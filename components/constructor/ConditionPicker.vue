<template>
  <div>
    <v-item-group mandatory>
      <v-row>
        <template v-if="scenes.length > 1">
          <v-timeline>
            <v-timeline-item color="deep-purple" right>
              <span slot="opposite">Выберите условие</span>
              <div>
                <v-select
                  v-model="selectedCondition"
                  :items="conditions"
                />
              </div>
            </v-timeline-item>
            <template v-if="selectedCondition">
              <v-timeline-item color="deep-purple" right>
                <span slot="opposite">Укажите сцену</span>
                <div>
                  <v-text-field
                    v-model="searchKeyword"
                    :clearable="true"
                    label="Поиск сцены по названию"
                  />

                  <v-list flat style="max-height: 300px; overflow-y: scroll">
                    <v-list-item-group color="deep-purple">
                      <v-list-item
                        v-for="(_scene, i) in filteredScenes"
                        :key="i"
                        :class="{ active: _scene.id === pickedScene.id}"
                      >
                        <v-list-item-icon>
                          <v-avatar v-if="_scene.background && _scene.background.type === 'image'">
                            <img
                              :src="_scene.background.value"
                              :alt="_scene.title"
                            >
                          </v-avatar>
                          <v-avatar
                            v-else-if="_scene.background && _scene.background.value"
                            :color="_scene.background.value"
                          />
                          <v-avatar v-else color="grey" />
                        </v-list-item-icon>

                        <v-list-item-content @click="pickScene(_scene)">
                          <v-list-item-title>{{ _scene.title }} - {{ excerpt(_scene.mainText, excerptLimit) }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </v-timeline-item>
              <v-timeline-item color="deep-purple" right>
                <span slot="opposite">Выберите альтернативу</span>
                <v-select
                  v-model="selectedElseCondition"
                  :items="elseConditions"
                />
              </v-timeline-item>
            </template>
          </v-timeline>

          <v-col
            class="d-flex"
            cols="12"
          >
            <v-btn dark @click="setCondition">
              Подтвердить
            </v-btn>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="12" class="pt-5">
            <p>Сцены еще не были добавлены.</p>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-btn depressed color="purple" rounded dark @click="callToAddingScene">
              Добавить сцену
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-item-group>
  </div>
</template>

<script>
import { excerpt } from '@/plugins/utils'
export default {
  props: {
    scene: { type: Object, required: true },
    action: { type: Object, required: true }
  },
  data () {
    return {
      searchKeyword: '',
      excerptLimit: 30,
      selectedCondition: false,
      pickedScene: false,
      selectedElseCondition: 'block'
    }
  },
  computed: {
    filteredScenes () {
      const scenesWithoutCurrent = this.scenes.filter(scene => scene.id !== this.scene.id)

      if (!this.searchKeyword) { return scenesWithoutCurrent }

      return scenesWithoutCurrent.filter((scene) => {
        if (scene.title.includes(this.searchKeyword)) {
          return true
        } else {
          return scene.mainText.substring(0, this.excerptLimit).includes(this.searchKeyword)
        }
      })
    },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    conditions () {
      return this.$store.getters['constructorStorage/getConditions']
    },
    elseConditions () {
      return this.$store.getters['constructorStorage/getElseConditions']
    }
  },
  watch: {
    action () {
      this.copyConditionData()
    }
  },
  mounted () {
    this.copyConditionData()
  },
  methods: {
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    },
    copyConditionData () {
      if (typeof this.action.condition === 'object') {
        this.selectedCondition = { ...this.action.condition }
      }
    },
    callToAddingScene () {
      const newScene = this.$store.getters['constructorStorage/getEmptyScene']()
      this.$store.dispatch('constructorStorage/addScene', newScene)
      this.setCondition(newScene)
    //   this.$emit('callToAddingScene')
    },
    removeCondition () {
      this.$emit('OnConditionPicked', false)
    },
    pickScene (scene) {
      this.pickedScene = scene
    },
    setCondition () {
      if (this.selectedCondition === false) {
        this.removeCondition()
      } else {
        this.$emit('OnConditionPicked', {
          type: this.selectedCondition,
          value: this.pickedScene.id,
          else: this.selectedElseCondition
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.v-list-item--active.active
  background: linear-gradient(90deg, #673ab72b, #fff)
</style>
