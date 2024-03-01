let vennData = [
  { sets: [this.scheme1name], value: this.scheme1cnt },
  { sets: [this.scheme2name], value: this.scheme2cnt },
  { sets: [this.scheme1name, this.scheme2name], value: this.int12cnt }
];

// Adjust the size of circles based on data
this.vennChartElement.data.datasets[0].data = vennData.map(item => item.value);

// Other chart options (adjust as needed)
this.vennChartElement.options.aspectRatio = 2; // Adjust the aspect ratio
this.vennChartElement.options.layout.padding = 20; // Adjust padding

// Update the chart to apply changes
this.vennChartElement.update();












makeChart() {
  this.vennChartElement = new Chart("myChart", {
    type: 'venn',
    data: {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],  // Make sure this is an array of numbers representing circle sizes
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 205, 86, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          borderWidth: 3,
        },
      ],
    },
    options: {
      aspectRatio: 2,  // Experiment with this value
      layout: {
        padding: 20,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}
