
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function PassFailPieChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow h-[300px] flex flex-col items-center">
      {/* Title */}
      <h3 className="font-semibold text-sm mb-2">
        Department Pass/Fail Rate
      </h3>

      {/* Chart Wrapper */}
      <div className="h-[230px] w-full flex items-center justify-center">
        <Pie
          data={{
            labels: ["Pass", "Fail"],
            datasets: [
              {
                data: [92, 8],
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 10,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
