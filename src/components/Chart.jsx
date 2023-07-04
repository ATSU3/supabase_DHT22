import React from 'react';
import AreaChart from './AreaChart';
import '../scss/components/chart.scss';

const Chart = () => {
    return (
        <div className='chart'>
            <AreaChart area_id={1} />
            <AreaChart area_id={2} />
            <AreaChart area_id={3} />
        </div>
    );
};

export default Chart;
