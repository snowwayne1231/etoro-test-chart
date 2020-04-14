<template>
    <div class="result">
        <button @click="onClickStartCounting">開始運算</button>
        <table>
            <tbody>
                <tr>
                    <th>獲利率:</th>
                    <td :class="balanceClassName">{{result.balance}}</td>
                </tr>
                <tr>
                    <th>建議 [收倉盈收率] / 獲利:</th>
                    <td>{{suggest_revege}} / <span :class="max_benefit > 0 ? 'good' : 'bad'">{{max_benefit}}</span></td>
                </tr>
                <tr>
                    <th>開倉數:</th>
                    <td>{{result.positions.length}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { BilateralBuy } from '@/investmethods/OpenPosition.js';

export default {
    name: 'Result',
    data() {
        return {
            suggest_revege: 0,
            max_benefit: '',
        };
    },
    computed: {
        ...mapState(['result', 'setting', 'stock']),
        balanceClassName(self) {
            const _ = self.result.balance;
            return _ > 0 ? 'good' : _ < 0 ? 'bad' : 'none';
        },
    },
    methods: {
        onClickStartCounting() {
            const result = BilateralBuy(
                this.stock.pointTrends,
                this.setting,
            );
            let _suggest_revege = 0;
            let benefit = -1;
            for (let i = 1; i <= 50; i++) {
                let res = BilateralBuy(
                    this.stock.pointTrends,
                    {...this.setting, ratio_close_position_revenue: i},
                    true,
                );
                
                if (res.balance > benefit) {
                    benefit = res.balance;
                    _suggest_revege = i;
                }
            }
            this.suggest_revege = _suggest_revege;
            this.max_benefit = benefit.toFixed(2);
            console.log(result);
            this.$store.commit('UPDATE_RESULT', result);
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.result {
    width: 100%;
    display: block;

    table {
        width: 100%;
        border: 1px solid #999;

        th {
            text-align: left;
            width: 60%;
        }

        td {
            text-align: right;
            width: 40%;
        }

        .good {
            color: green;
        }

        .bad {
            color: red;
        }
    }

    button {
        width: 200px;
        height: 48px;
        font-size: 16px;
        margin: 5px;
    }
}
</style>
