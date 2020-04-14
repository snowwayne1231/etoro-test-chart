<template>
    <div class="home">
        <div class="home-panel">
            <Setting></Setting>
            <Result></Result>
        </div>
        <div class="home-chart">
            <Chart></Chart>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Setting from '@/components/Setting.vue';
import Result from '@/components/Result.vue';
import Chart from '@/components/Chart.vue';




export default {
    name: 'Home',
    components: {
        Setting,
        Result,
        Chart,
    }
}
</script>

<style lang='scss'>
.home {
    display: flex;
    position: relative;
    width: 100%;

}
.home-panel {
    width: 30%;
    min-height: 520px;
    position: relative;

    .result {
        position: absolute;
        bottom: 0px;
    }
}

.home-chart {
    width: 70%;
}
</style>
