<template>
    <div>
        <v-item-group v-if="backs.length" mandatory>
            <v-row>
                <v-col cols="12" md="6" class="pt-0">
                    <v-text-field 
                        class="pt-0"
                        :clearable="true" 
                        label="Поиск по названию" 
                        v-model="nameSearchKey"
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="pt-0">
                    <v-select
                        :items="categories"
                        class="pt-0"
                        label="Поиск по категории"
                        :disabled="!categories.length"
                        :clearable="true"
                        v-model="activeCategory"
                    ></v-select>
                </v-col>

                <template v-if="filteredBacks.length">
                
                    <v-col
                    v-for="back in filteredBacks"
                    :key="back.id"
                    cols="12"
                    md="4"
                    >
                        <v-item>
                            <v-card
                                :color="back == activeBack ? 'primary' : ''"
                                class="d-flex align-center back-item"
                                dark
                                height="200"
                                :style="'background-image: url('+back.url_medium+');'"
                                @click="changeBack(back)"
                            >
                                <v-scroll-y-transition>
                                    <div
                                        class="flex-grow-1 text-center"
                                    >
                                        <span v-if="back != activeBack">
                                            {{back.name}}
                                        </span>

                                        <span v-else>
                                            {{back.name}} - Активно
                                        </span>
                                    </div>

                                </v-scroll-y-transition>
                            </v-card>
                        </v-item>
                    </v-col>
                </template>
                
                <template v-else>
                    <v-col>
                        <p>Фоны не найдены...</p>
                    </v-col>
                </template>

            </v-row>
        </v-item-group>
    </div>
</template>

<script>
export default {
    name: 'BackgroundPicker',
    data(){
            return {
                nameSearchKey: '',
                activeBack: null,
                activeCategory: false,
                backs: [],
                categories: [],
            }
          },
    mounted(){
      this.getBacks()
      this.getBackCats()
    },
    computed:{
        filteredBacks(){
        
            if(!this.nameSearchKey && !this.activeCategory) return this.backs
    
            var backs = this.backs
            
            if(this.nameSearchKey)
                backs = this.backs.filter( item => {
                    return item.name.toLowerCase().indexOf(this.nameSearchKey.toLowerCase()) !== -1
                })

            if(this.activeCategory){
                backs = backs.filter( item => {
                    
                    var result = false

                    for (let index = 0; index < item.categories.length; index++) {
                        let category = item.categories[index];

                        if(category.name == this.activeCategory){
                            result = true
                            break
                        }
                    }

                    return result
                })
            }

            return backs
        }
    },
    methods:{
      changeBack(back){
        this.activeBack = back
        this.$emit('OnBackChanged', this.activeBack)
      },
      getBacks(){
        axios.get('/api/game/get-backgrounds').then(res => {
          this.backs = res.data
          this.changeBack(res.data[0]) // устанавливаем первый бекграунд, как активный
        });
      },
      getBackCats(){
        axios.get('/api/game/get-background-categories').then(res => {
            this.categories = res.data.map( item => {
                    item.value = item.text = item.name
                    return item
                })
        });
      }
    }
}
</script>