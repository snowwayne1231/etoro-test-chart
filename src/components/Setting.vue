<template>
    <div class="setting">
        <ul>
            <li>
                <label>資料</label>
            </li>
            <li>
                <input tpye='text' v-model="local_json_file_name" @blur="onChangeFileName">
            </li>
        </ul>
        <ul>
            <li>
                <label>投入方式</label>
            </li>
            <li>
                <select @change="onClickConfirm">
                    <option v-for="(v, i) in option.type" :key="i" :value="i">{{v}}</option>
                </select>
            </li>
        </ul>
        <ul>
            <li>
                <label>點差 (%)</label>
            </li>
            <li>
                <input tpye='number' v-model="local_ratio_spread" @blur="onClickConfirm">
            </li>
        </ul>
        <ul>
            <li>
                <label>最小補倉率(%)</label>
            </li>
            <li>
                <input tpye='number' v-model="local_ratio_add_position" @blur="onClickConfirm">
            </li>
        </ul>
        <ul>
            <li>
                <label>槓桿</label>
            </li>
            <li>
                <input tpye='number' v-model="local_lever" @blur="onClickConfirm">
            </li>
        </ul>
        <ul>
            <li>
                <label>收倉盈收 (%)</label>
            </li>
            <li>
                <input tpye='number' v-model="local_ratio_close_position_revenue" @blur="onClickConfirm">
            </li>
        </ul>
        <ul>
            <li>
                <label>止損 (%)</label>
            </li>
            <li>
                <input tpye='number' v-model="local_ratio_close_position_loss" @blur="onClickConfirm">
            </li>
        </ul>
        <ul>
            <li>
                <label>最大同倉數</label>
            </li>
            <li>
                <input tpye='number' v-model="local_max_num_postion" @blur="onClickConfirm">
            </li>
        </ul>
        <ul>
            <li>
                
            </li>
            <li>
                <!-- <button @click="onClickConfirm">確認</button> -->
            </li>
        </ul>

    </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';


export default {
    name: 'Setting',
    data() {
        let d = new Date();
        let today = `${d.getUTCFullYear()}-${String(d.getUTCMonth() +1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        return {
            local_ratio_spread: 0.00,
            local_ratio_add_position: 0,
            local_lever: 0,
            local_ratio_close_position_revenue: 0.00,
            local_ratio_close_position_loss: 0.00,
            local_max_num_postion: 0,
            local_json_file_name: '27-' + today,
        };
    },
    computed: {
        ...mapState(['option', 'setting']),
    },
    mounted() {
        
        this.onChangeFileName().then(this.init);
        
    },
    methods: {
        init() {
            this.refreshLocalData();
        },
        refreshLocalData() {
            this.local_ratio_spread = this.setting.ratio_spread;
            this.local_ratio_close_position_revenue = this.setting.ratio_close_position_revenue;
            this.local_ratio_close_position_loss = this.setting.ratio_close_position_loss;
            this.local_lever = this.setting.lever;
            this.local_max_num_postion = this.setting.max_num_postion;
            this.local_ratio_add_position = this.setting.ratio_add_position;
        },
        onClickConfirm() {
            this.$store.commit('UPDATE_SETTING', {
                ratio_spread: this.local_ratio_spread,
                ratio_close_position_revenue: this.local_ratio_close_position_revenue,
                ratio_close_position_loss: this.local_ratio_close_position_loss,
                lever: this.local_lever,
                max_num_postion: this.local_max_num_postion,
                ratio_add_position: this.local_ratio_add_position,
            });
        },
        onChangeFileName() {
            let file = this.local_json_file_name.replace(/\.json$/i, '');
            let url = `/data/${file}.json`;
            return this.$store.dispatch('getStockByURL', url);
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.setting {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border: 2px outset #666;
    
    ul {
        display: flex;
        margin: 0px;
        padding: 0px;
        text-align: left;
        width: 100%;

        li {
            display: inline-block;
            width: 50%;
        }

        input {
            width: auto;
            max-width: 128px;
            padding: 2px;
            margin: 0px;
        }

        button {
            width: 100%;
            text-align: center;
        }
    }
}
</style>
