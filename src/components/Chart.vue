<template>
    <div class="chart">
        <svg :width="svgWidth" :height="svg_height">
            <text v-for="index in svgLines" :key="index"
                x="0"
                :y="svg_height - ((index - min) * gap)"
                fill="blue"
            >{{index}}</text>

            <line v-for="index in svgLines" :key="`line_${index}`"
                x1="0"
                :y1="svg_height - ((index - min) * gap)"
                :x2="svgWidth"
                :y2="svg_height - ((index - min) * gap)"
                style="stroke:rgb(155,155,155);stroke-width:1;opacity:0.4;">
            </line>

            <circle v-for="(p, idx) in stock.pointTrends" :key="idx"
                :cx="getXbyIndex(idx)"
                :cy="getYbyPoint(p.point)"
                r="1"
                fill="black"
            />
            <path :d="svgPath" stroke="gray" stroke-width="1" fill="none"/>

            <line v-for="(pos, idx) in showPositions" :key="`pos_${idx}`"
                :x1="getXbyIndex(pos.startidx)"
                :y1="getYbyPoint(pos.open)"
                :x2="getXbyIndex(pos.startidx)"
                :y2="getYbyPoint(pos.close)"
                :style="`stroke:${pos.net > 0 ? 'limegreen' : 'red'}; stroke-width:2;opacity:0.4;`">
            </line>

        </svg>
        <div class="bar" :style="{width: `${svgWidth}px`, height: `${local_height-svg_height}px`}">
            <span v-for="(time, idx) in timeLines" :key="`time_${idx}`"
                class="bar-text"
                :style="{
                    left: `${getXbyIndex(idx * time_line_index_gap)}px`,
                }"
            >{{time.dateshow}}</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'Chart',
    data() {
        return {
            svg_height: 500,
            local_height: 540,
            local_gap: 1,
            time_line_index_gap: 30,
        };
    },
    computed: {
        ...mapState(['result', 'stock']),
        svgWidth(self) {
            return self.stock.pointTrends.length * 4 + 50;
        },
        min(self) {
            let _min = 50000;
            self.stock.pointTrends.map(p => {
                if (p.point < _min) {
                    _min = p.point;
                }
            });
            return Math.floor(_min);
        },
        max(self) {
            let _max = 0;
            self.stock.pointTrends.map(p => {
                if (p.point > _max) {
                    _max = p.point;
                }
            });
            return Math.ceil(_max);
        },
        gap(self) {
            let _gap = self.max - self.min;
            return Math.floor(self.svg_height / _gap);
        },
        svgLines(self) {
            let _gap = self.max - self.min;
            let _every = Math.max(10, Math.ceil(_gap / 10));
            let _ary = [];
            for (let i = self.min; i <= self.max; i+= _every) {
                _ary.push(i);
            }
            return _ary;
        },
        svgPath(self) {
            let str = 'M';
            self.stock.pointTrends.map((e, idx) => {
                if (idx == 0) {
                    str += `${self.getXbyIndex(idx)},${self.getYbyPoint(e.point)} `;
                } else {
                    str += `L${self.getXbyIndex(idx)},${self.getYbyPoint(e.point)} `;
                }
            });
            // console.log('svgPath: ', str);
            return str;
        },
        timeLines(self) {
            const res = [];
            let points = self.stock.pointTrends;
            for(let i = 0; i < points.length; i+= self.time_line_index_gap) {
                let loc = points[i];
                let _splited = loc.date.split('T');
                const dateshow = _splited.length > 1 ? _splited[1] : _splited[0];
                res.push({
                   dateshow, 
                    ...loc,
                });
            }
            return res;
        },
        showPositions(self) {
            return self.result.positions;
        },
    },
    mounted() {
        console.log(this.result);
    },
    methods: {
        getXbyIndex(idx) {
            return idx *4 + 50;
        },
        getYbyPoint(point) {
            return (this.svg_height - ((point - this.min)* this.gap)).toFixed(1);
        },
    },
}
</script>


<style scoped lang="scss">
.chart {
    position: relative;
    overflow-y: hidden;
    overflow-x: auto;
    width: 100%;
    height: 540px;
    box-sizing: border-box;
    
    .bar {
        position: relative;
        height: 30px;

        .bar-text {
            position: absolute;
            display: inline-block;
            left: 0px;
        }
    }
}

</style>
