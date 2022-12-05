<template>
  <v-container class="fill-in-height">
    <v-row>
      <v-col cols="12">
        <h2>Загрузка изображения</h2>
        <v-file-input
          v-model="file"
          accept="image/*"
          label="File input"
        />
        <v-btn @click="load">
          Загрузить
        </v-btn>
      </v-col>
    </v-row>
    <hr>
    <v-row>
      <v-col cols="12">
        <h2>Удаление изображения</h2>
        <v-text-field
          v-model="fileId"
          label="File id"
        />
        <v-btn @click="deleteFile">
          Удалить
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      file: null,
      fileId: null
    }
  },
  head () {
    return {
      title: 'Админ-панель'
    }
  },
  mounted () {},
  methods: {
    load () {
      const formData = new FormData()
      formData.append('file', this.file)
      this.$api.call('uploadImage', null, formData)
    },
    deleteFile () {
      this.$api.call('deleteImage', this.fileId)
    }
  }
}
</script>
