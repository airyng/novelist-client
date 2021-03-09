<template>
    <v-row>
        <v-col sm="10" class="d-flex">

            <!-- Кнопки перемещения очередности -->
            <div 
                v-if="activeScene.actions.length > 1"
                class="d-flex flex-column mt-1 mr-1"
            >
                <v-icon 
                    class="curs-pointer" 
                    :class="{disabled: activeScene.actions.indexOf(action) <= 0}"
                    rounded
                    @click="changeActionOrder(action, 'up')"
                >mdi-arrow-up-drop-circle-outline</v-icon>
                <v-icon 
                    class="curs-pointer" 
                    rounded
                    :class="{disabled: activeScene.actions.indexOf(action) >= activeScene.actions.length - 1}"
                    @click="changeActionOrder(action, 'down')"
                >mdi-arrow-down-drop-circle-outline</v-icon>
            </div>
            <!-- Кнопки перемещения очередности - конец -->

            <v-text-field
                name="actionText"
                label="Действие/Ответ"
                filled
                :counter="actionTextMaxLength"
                v-model="action.actionText"
                background-color="#444"
                dark
            ></v-text-field>
        </v-col>
        <v-col sm="2">
                        
            <v-tooltip top v-if="typeof action.to == 'number'">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip
                        close
                        color="purple"
                        text-color="white"
                        @click:close="clearActionToParam(action)"
                        @click="OnGoToScene(action.to)"
                        v-bind="attrs"
                        v-on="on"
                    >
                        {{ getSceneById(action.to).title }}
                    </v-chip>
                </template>
                <span>Переход на {{ getSceneById(action.to).title }}</span>
            </v-tooltip>

            <v-tooltip top v-if="action.to == 'quit'">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip
                        close
                        color="black"
                        text-color="white"
                        @click:close="clearActionToParam(action)"
                        v-bind="attrs"
                        v-on="on"
                    >
                        Выход
                    </v-chip>
                </template>
                <span>Выход из новеллы</span>
            </v-tooltip>
            
            <v-menu left bottom>
                <template v-slot:activator="{ on, attrs }">
                
                    <v-btn
                        rounded fab dark small
                        class="text-center justify-center"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon rounded>mdi-dots-horizontal</v-icon>
                    </v-btn>
                </template>
                

                <v-list>

                    <v-list-item
                        @click="openScenePicker(action)"
                    >
                        <v-list-item-title>
                            Переход на сцену
                        </v-list-item-title>
                    </v-list-item>
                        
                    
                    <v-list-item
                        @click="setQuitAction(action)"
                    >
                        <v-list-item-title>
                            Выход
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-btn
                v-if="activeScene.actions.length > 1"
                rounded fab dark small
                class="text-center justify-center"
                @click="removeAction(action)"
            >
                <v-icon rounded>mdi-close</v-icon>
            </v-btn>
        </v-col>

        <custom-dialog
            :toggler="scenePickerDialog"
            @onDialogStateChanged="onScenePickerDialogStateChanged"
            title="Выберите сцену"
        >
            <scene-picker 
                :currentScene="activeScene"
                :scenes="scenes"
                :action="pickedAction"
                @callToAddingScene="onAddSceneAndGo"
                @OnScenePicked="setAction"
            ></scene-picker>
        </custom-dialog>
    </v-row>
</template>

<script>
export default {
    props: {
        actionTextMaxLength: {
            required: true
        },
        activeScene: {
            required: true
        },
        action: {
            required: true
        },
        scenes: {
            required: true
        }
    },
    data() {
        return {
            scenePickerDialog: false,
            pickedAction: false, // экшн, который будет передан в компонент для настройки
        }
    },
    methods: {
        setQuitAction (action) {
            var data = {type: 'quit', action: action}
            this.setAction( data )
        },
        changeActionOrder (action, direction) {

            var index = this.activeScene.actions.indexOf(action)

            if(direction == 'up'){
                // нельзя уйти выше первого значения
                if(index <= 0) return

                this.activeScene.actions = this.moveArrElem(this.activeScene.actions, index, index - 1)
            }

            if(direction == 'down'){
                // нельзя уйти ниже последнего значения
                if(index >= this.activeScene.actions.length - 1) return

                this.activeScene.actions = this.moveArrElem(this.activeScene.actions, index, index + 1)
            }
            
        },
        moveArrElem (arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1
                while (k--) {
                    arr.push(undefined)
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
            return arr // for testing
        },
        clearActionToParam ( action ) {
            action.to = false
        },
        OnGoToScene ( scene ) {
            this.$emit('OnGoToScene', scene)
        },
        openScenePicker ( action ) { // передаем выбранный экшн
            this.scenePickerDialog = true
            this.pickedAction = action
        },
        closeScenePicker () {
            this.scenePickerDialog = false
        },
        onScenePickerDialogStateChanged ( data ) {
            this.scenePickerDialog = data
        },
        setAction ( data ) { // {type: [string], action: [object], scene: [object]}

            if(data.type == 'scene') {
                for(var action in this.activeScene.actions){
                    if(this.activeScene.actions[action].id == data.action.id){
                        this.activeScene.actions[action].to = data.scene.id
                    }
                }
                // закрываем диалоговое окно выбора сцены
                // возможно стоит вынести в отдельный метод,
                // если текущий метод будет еще где-то использоваться
                this.closeScenePicker()
            }

            if(data.type == 'quit') {
                for(var action in this.activeScene.actions){
                    if(this.activeScene.actions[action].id == data.action.id){
                        this.activeScene.actions[action].to = 'quit'
                    }
                }
            }

        },
        onAddSceneAndGo ( data ) {
            this.$emit('onAddSceneAndGo', data)
            this.closeScenePicker()
        },
        removeAction ( action ) {
            var index = this.activeScene.actions.indexOf(action)

            if(index >= 0) this.activeScene.actions.splice(index, 1)
        },
        getSceneById ( id ) {
            return this.scenes.filter( scene => scene.id == id ) [0]
        },
    }
}
</script>