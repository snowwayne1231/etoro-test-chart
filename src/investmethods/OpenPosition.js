
export function BilateralBuy(pointTrends, settings, forcalculate=false) {
    const ratio_spread = settings.ratio_spread || 0.00;
    const ratio_min_should_add_position = settings.ratio_add_position || 0;
    const lever = settings.lever || 1;
    const ratio_stop_loss = settings.ratio_close_position_loss || 50;
    const stop_loss = ratio_stop_loss / 100;
    const ratio_collect = settings.ratio_close_position_revenue || 5;
    const collect = ratio_collect / 100;
    const max_position = settings.max_num_postion || 0;
    const margin_spread = pointTrends[0].point * (ratio_spread / 100);
    if (!forcalculate) {
        console.log('margin_spread', margin_spread);
        console.log('lever', lever);
    }
    

    const result = {
        positions: [],
        balance: 0,
    }

    const exist_long_positions = [];
    const exist_short_positions = [];
    const _st = new Date().getTime();

    let point = 0;

    pointTrends.map((p, idx) => {
        point = p.point;

        for (let i = 0; i < exist_long_positions.length; i++) {
            let long = exist_long_positions[i];
            // console.log('long: ', long);
            let position = result.positions[long];
            let open = position.open;
            let gap_r = (point - open) * lever / open;
            if ((gap_r >= collect) || (gap_r <= -(stop_loss))) {
                closePostion(position, point, idx, lever);
                // console.log('closePostion: ', idx, point);
                exist_long_positions.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < exist_short_positions.length; i++) {
            let short = exist_short_positions[i];
            let position = result.positions[short];
            let open = position.open;
            let gap_r = (point - open) * lever / open;
            if ((gap_r >= stop_loss) || (gap_r <= -(collect))) {
                closePostion(position, point, idx, lever);
                exist_short_positions.splice(i, 1);
                i--;
            }
        }

        if (exist_long_positions.length < max_position && exist_long_positions.length <= exist_short_positions.length+1) {
            let lastLong = exist_long_positions[exist_long_positions.length-1];
            let gap_r = ratio_min_should_add_position;
            
            if (lastLong) {
                let lastOpen = result.positions[lastLong].open;
                gap_r = Math.abs((point - lastOpen) / lastOpen);
            }
            
            if (gap_r >= ratio_min_should_add_position) {
                let postion = openPosition(1, point + margin_spread, idx);
                exist_long_positions.push(result.positions.length);
                result.positions.push(postion);
            }
            
        }

        if (exist_short_positions.length < max_position && exist_long_positions.length >= exist_short_positions.length-1) {
            let lastShort = exist_short_positions[exist_short_positions.length-1];
            let gap_r = ratio_min_should_add_position;
            if (lastShort) {
                let lastOpen = result.positions[lastShort].open;
                gap_r = Math.abs((point - lastOpen) / lastOpen);
            }

            if (gap_r >= ratio_min_should_add_position) {
                // let postion = openPosition(2, point - margin_spread, result.positions.length);
                let postion = openPosition(2, point - margin_spread, idx);
                exist_short_positions.push(result.positions.length);
                result.positions.push(postion);
            }
        }

    });
    // console.log(pointTrends);
    // console.log(settings);
    result.positions.map(pos => {
        if (pos.net == 0) {
            closePostion(pos, point, pointTrends.length -1, lever);
        }

        result.balance += pos.net;
    });
    if (forcalculate) {
        result.positions = null;
    } else {
        const _ed = new Date().getTime();
        console.log(`Spend Time: ${_ed - _st}`);
    }
    return result;
}

export default function openPosition(type, now_point, idx = 0) {
    const pos_format = {
        type: type==1 ? 1 : 2,   // 1 = long , 2 = short
        open: now_point,
        close: 0.00,
        net: 0,
        startidx: idx,
        closeidx: -1,
    }
    return pos_format;
}

export function closePostion(input, point, idx = 0, lever = 1) {
    const p = input;
    p.close = point;
    const margin = ((p.close - p.open) / p.open) * lever;
    if (p.type == 1) {
        p.net = margin;
    } else {
        p.net = -(margin);
    }
    p.closeidx = idx;
    return input;
}