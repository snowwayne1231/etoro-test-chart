import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        option: {
            type: ['Bilateral Buy']
        },
        setting: {
            type: 0,
            ratio_spread: 0.03,
            ration_add_position: 0.10,
            lever: 10,
            ratio_close_position_revenue: 3,
            ratio_close_position_loss: 50,
            max_num_postion: 10,
        },
        result: {
            balance: 0.00,
            positions: [],
        },
        stock: {
            date_start: new Date(),
            date_end: new Date(),
            pointTrends: [],
        },
    },
    mutations: {
        UPDATE_SETTING(state, payload) {
            state.setting = payload;
        },
        UPDATE_OPTION(state, payload) {
            state.option = payload;
        },
        UPDATE_STOCK(state, payload) {
            state.stock = payload;
        },
        UPDATE_RESULT(state, payload) {
            state.result = payload;
        },
    },
    actions: {
        getStockByURL({commit}, url) {
            return Axios.get(url).then((res) => {
                try {
                    const data = res.data;
                    const pointTrends = data.Candles[0].Candles.map(e => {
                        return {
                            point: e.Open,
                            date: e.FromDate,
                        }
                    }).reverse();

                    commit('UPDATE_STOCK', {
                        date_start: new Date(pointTrends[0].date),
                        date_end: new Date(pointTrends[pointTrends.length-1].date),
                        pointTrends,
                    })
                    // console.log(pointTrends);
                } catch (err) {
                    console.log(res);
                    console.log(err);
                }
                return res;
            });
        },
    },
    modules: {

    }
})
