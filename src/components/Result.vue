<template>
    <div class="result">
        <button @click="onClickStartCounting">開始運算</button>
        <table>
            <tbody>
                <tr>
                    <th>獲利率:</th>
                    <td :class="balanceClassName">{{result.ration_balance}}</td>
                </tr>
                <tr></tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { BilateralBuy } from '@/investmethods/OpenPosition.js';

export default {
    name: 'Result',
    computed: {
        ...mapState(['result', 'setting', 'stock']),
        balanceClassName(self) {
            const _ = self.result.ration_balance;
            return _ > 0 ? 'good' : _ < 0 ? 'bad' : 'none';
        },
    },
    methods: {
        onClickStartCounting() {
            const result = BilateralBuy(
                this.stock.pointTrends,
                this.setting,
            );
            console.log(result);
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
}
</style>
