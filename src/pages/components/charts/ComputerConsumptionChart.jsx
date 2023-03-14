{/* <script type="text/javascript">
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var data = google.visualization.arrayToDataTable([
    ['Computer', 'Total Usage'],
            @foreach ($computer_usage as $key => $computer)
    {!! "['{$computer['name']}', {$computer['total_usage']}],"!!}
    @endforeach
    ]);

    var options = {
        title: 'My Daily Activities'
        };

    var chart = new google.visualization.PieChart(document.getElementById('computer-chart'));

    chart.draw(data, options);
    }
</script> */}
import axios from "axios";
import { Chart } from "react-google-charts";

export default function ComputerConsumptionChart() {
    // axios
    // .get(config.get('api_url') + 'computers')
    // .then(function (response) {
    //   console.log(response);
    // });

    return (
        <div className="col-md-4">
            <div className="card ">
                <div className="card-header ">
                    <h4 className="card-title">Energy Consumption By Computer</h4>
                </div>
                <div className="card-body ">
                    <Chart
                        chartType="ScatterChart"
                        data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                        width="100%"
                        height="400px"
                        legendToggle
                    />
                </div>
            </div>
        </div>

    );
}