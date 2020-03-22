
export function BilateralBuy(pointTrends, settings) {
    const ratio_spread = settings.ratio_spread || 0.00;
    const ratio_min_should_add_position = settings.ratio_add_position || 0;
    const should_add = ratio_min_should_add_position / 100;
    const lever = settings.lever || 1;
    const ratio_stop_loss = settings.ratio_close_position_loss || 50;
    const stop_loss = ratio_stop_loss / 100;
    const ratio_collect = settings.ratio_close_position_revenue || 5;
    const collect = ratio_collect / 100;
    const max_position = settings.max_num_postion || 0;
    const ratio_half_spread = ratio_spread / 2;

    const result = {
        positions: [],
        balance: 0,
    }

    const exist_long_positions = [];
    const exist_short_positions = [];
    const _st = new Date().getTime();
    const closePostion = (idx, point) => {
        const p = result.positions[idx];
        p.close = point;
        p.net = (p.close - p.open) / p.open * lever;
    }

    pointTrends.map((p, idx) => {
        const point = p.point;

        for (let i = 0; i < exist_long_positions.length; i++) {
            let long = exist_long_positions[i];
            let position = result.positions[long];
            let open = position.open;
            let gap_r = (open - point) * lever / open;
            if ((gap_r >= collect) || (gap_r <= stop_loss)) {
                closePostion(long, point);
                exist_long_positions.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < exist_short_positions.length; i++) {
            let short = exist_short_positions[i];
            let position = result.positions[short];
            let open = position.open;
            let gap_r = (open - point) * lever / open;
            if ((gap_r >= stop_loss) || (gap_r <= collect)) {
                closePostion(short, point);
                exist_short_positions.splice(i, 1);
                i--;
            }
        }

        if (exist_long_positions.length < max_position) {
            let lastLong = exist_long_positions[exist_long_positions.length-1];
            let gap_r = 0;
            if (lastLong) {
                let lastOpen = result.positions[lastLong].open;
                let gap_r = (point - lastOpen) / lastOpen;
            }
            
            if (gap_r < -(should_add)) {
                let postion = openPosition(1, point, idx);
                exist_long_positions.push(idx);
                result.positions.push(postion);
            }
            
        }

        if (exist_short_positions.length < max_position) {
            let lastShort = exist_short_positions[exist_short_positions.length-1];
            let gap_r = 0;
            if (lastShort) {
                let lastOpen = result.positions[lastShort].open;
                gap_r = (point - lastOpen) / lastOpen;
            }

            if (gap_r > should_add) {
                let postion = openPosition(2, point, idx);
                exist_short_positions.push(idx);
                result.positions.push(postion);
            }
        }

    });
    // console.log(pointTrends);
    // console.log(settings);
    const _ed = new Date().getTime();
    console.log(`Spend Time: ${_ed - _st}`);
    return result;
}

export default function openPosition(type, now_point, idx = 0) {
    const pos_format = {
        type: type==1 ? 1 : 2,   // 1 = long , 2 = short
        open: now_point,
        close: 0.00,
        net: 0.00,
        idx,
    }
    return pos_format;
}