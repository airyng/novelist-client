<template>
  <v-list-item-avatar
    size="62"
    color="grey"
    :class="{'c-events-none': !allowUpload}"
    @click.native="uploadAvatarHandler"
  >
    <div
      v-if="avatarUrl"
      class="avatar_image"
      :title="allowUpload ? 'Загрузить аватар' : null"
      :style="{ backgroundImage: `url(${avatarUrl})`}"
    />
  </v-list-item-avatar>
</template>

<script>
import { ErrorMessage, SuccessMessage } from '@/plugins/toast'
import { EventBus } from '~/plugins/event'

export default {
  props: {
    userId: { type: String, default: null },
    avatarId: { type: String, default: null },
    allowUpload: { type: Boolean, default: false }
  },
  data () {
    return {
      avatarUrl: null
    }
  },
  mounted () {
    this.init()
    EventBus.$on('logged-in', this.init)
  },
  beforeDestroy () {
    EventBus.$off('logged-in', this.init)
  },
  methods: {
    async init () {
      let user = null
      if (this.userId) {
        user = await this.$store.dispatch('usersRepository/userFetch', this.userId)
        if (!user?.avatar_id) { return }
      }
      this.avatarUrl = await this.$store.dispatch('imagesRepository/linkFetch', this.avatarId || user?.avatar_id)
    },
    async uploadAvatarHandler () {
      if (!this.allowUpload) { return }
      try {
        const files = await this.openFileDialog()
        if (!files) { return }

        const loadImageResponse = await this.loadImage(files[0])

        if (![200, 201].includes(loadImageResponse.status)) {
          // TODO: Здесь нужно сделать какую-то обработку ошибок, чтобы
          // пользователь понимал почему не получается загрузить изображение
          ErrorMessage({ text: 'Ошибка загрузки изображения.' })
          return
        }
        const updateUserResponse = await this.$api.call(
          'updateUser',
          this.$store.state.userData._id,
          {
            id: this.$store.state.userData._id,
            avatar_id: loadImageResponse.data._id
          }
        )

        if ([200, 201].includes(updateUserResponse.status)) {
          SuccessMessage('Изображение успешно загружено!')
          await this.$store.dispatch('fetchUserData')
          return
        }
        ErrorMessage(updateUserResponse?.data?.message)
      } catch (err) {
        ErrorMessage('Ошибка обработки данных. Обратитесь службу поддержки сервиса.')
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },
    /**
     * Метод открывает окно выбора файла
     * Возвращает промис. Результатом выполнения промиса будут
     * либо выбранные файлы, либо false в случае закрытия окна без выбора
     * @returns {Promise}
     */
    openFileDialog () {
      // TODO: желательно этот метод вынести в отдельный файл помощник или миксин,
      // так как он выполнен без привязки к контексту текущего компонента
      // и может быть использован где угодно.
      return new Promise((resolve) => {
        const fileSelector = document.createElement('input')
        fileSelector.setAttribute('type', 'file')

        fileSelector.oninput = (event) => {
          fileSelector.oninput = null
          resolve(event.path[0].files)
        }

        document.body.onfocus = () => {
          document.body.onfocus = null
          setTimeout(() => {
            if (!fileSelector?.files?.length) {
              resolve(false)
            }
          }, 100)
        }

        fileSelector.click()
      })
    },
    async loadImage (file) {
      const formData = new FormData()
      formData.append('file', file)
      return await this.$api.call('uploadImage', null, formData)
    }
  }
}
</script>

<style lang="sass" scoped>
.avatar_image
  border-radius: 100%
  background-size: cover
  background-position: center
  background-repeat: no-repeat
  width: 100%
  height: 100%
</style>
