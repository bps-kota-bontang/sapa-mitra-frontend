<template>
  <div
    style="
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    "
  >
    <Bar
      v-if="load"
      :options="optionsByStatus"
      :data="dataByStatus"
      :style="style"
    />
    <Bar
      v-if="load"
      :options="optionsByTeam"
      :data="dataByTeam"
      :style="style"
    />
    <Line
      v-if="load"
      :options="optionsPartners"
      :data="dataPartners"
      :style="style"
    />
    <Line
      v-if="load"
      :options="optionsActivities"
      :data="dataActivities"
      :style="style"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getContractStatistic } from "@/api/contractApi";
import { Bar, Line } from "vue-chartjs";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

const style = ref({
  width: "700px",
});

const load = ref(false);
const dataByStatus = ref({
  labels: ["Test"] as string[],
  datasets: [
    {
      label: "Verified",
      data: [1] as number[],
      backgroundColor: "#f87979",
    },
    {
      label: "Unverified",
      data: [2] as number[],
      backgroundColor: "#f24179",
    },
  ],
});

const optionsByStatus = ref({
  plugins: {
    title: {
      display: true,
      fullSize: true,
      text: "Jumlah kegiatan berdasarkan status tiap periode",
    },
  },
  responsive: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      min: 0,
      max: 20,
      ticks: {
        stepSize: 1,
      },
    },
  },
});

const dataByTeam = ref({
  labels: ["Test"] as string[],
  datasets: [
    {
      label: "SOSIAL",
      data: [1] as number[],
      backgroundColor: randomRGB(),
    },
    {
      label: "PRODUKSI",
      data: [2] as number[],
      backgroundColor: randomRGB(),
    },
    {
      label: "DISTRIBUSI",
      data: [3] as number[],
      backgroundColor: randomRGB(),
    },
    {
      label: "NERWILIS",
      data: [4] as number[],
      backgroundColor: randomRGB(),
    },
    {
      label: "IPDS",
      data: [5] as number[],
      backgroundColor: randomRGB(),
    },
    {
      label: "TU",
      data: [6] as number[],
      backgroundColor: randomRGB(),
    },
  ],
});

const optionsByTeam = ref({
  plugins: {
    title: {
      display: true,
      fullSize: true,
      text: "Jumlah kegiatan berdasarkan tim tiap periode",
    },
  },
  responsive: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      min: 0,
      max: 20,
      ticks: {
        stepSize: 1,
      },
    },
  },
});

const dataPartners = ref({
  labels: ["Test"] as string[],
  datasets: [
    {
      label: "Mitra",
      data: [1] as number[],
      backgroundColor: randomRGB(),
    },
  ],
});

const optionsPartners = ref({
  plugins: {
    title: {
      display: true,
      fullSize: true,
      text: "Jumlah mitra tiap periode",
    },
  },
  responsive: false,
  scales: {
    y: {
      min: 0,
      max: 20,
      ticks: {
        stepSize: 1,
      },
    },
  },
});

const dataActivities = ref({
  labels: ["Test"] as string[],
  datasets: [
    {
      label: "Kegiatan",
      data: [1] as number[],
      backgroundColor: randomRGB(),
    },
  ],
});

const optionsActivities = ref({
  plugins: {
    title: {
      display: true,
      fullSize: true,
      text: "Jumlah kegiatan tiap periode",
    },
  },
  responsive: false,
  scales: {
    y: {
      min: 0,
      max: 20,
      ticks: {
        stepSize: 1,
      },
    },
  },
});

const generateDataByStatus = (data: any) => {
  const labels: string[] = data.map((item: any) => item.period);
  const unverifiedData: number[] = data.map(
    (item: any) => item.status.Unverified
  );
  const verifiedData: number[] = data.map((item: any) => item.status.Verified);

  const datasets = [
    {
      label: "Belum verifikasi",
      data: unverifiedData,
      backgroundColor: "#E72929",
    },
    {
      label: "Sudah verifikasi",
      data: verifiedData,
      backgroundColor: "#059212",
    },
  ];

  return {
    labels,
    datasets,
  };
};

const generateDataByTeam = (data: any) => {
  const labels: string[] = data.map((item: any) => item.period);

  const sosialData: number[] = data.map((item: any) => item.teams.SOSIAL);
  const produksiData: number[] = data.map((item: any) => item.teams.PRODUKSI);
  const distribusiData: number[] = data.map(
    (item: any) => item.teams.DISTRIBUSI
  );
  const nerwilisData: number[] = data.map((item: any) => item.teams.NERWILIS);
  const ipdsData: number[] = data.map((item: any) => item.teams.IPDS);
  const tuData: number[] = data.map((item: any) => item.teams.TU);

  const datasets = [
    {
      label: "SOSIAL",
      data: sosialData,
      backgroundColor: randomRGB(),
    },
    {
      label: "PRODUKSI",
      data: produksiData,
      backgroundColor: randomRGB(),
    },
    {
      label: "DISTRIBUSI",
      data: distribusiData,
      backgroundColor: randomRGB(),
    },
    {
      label: "NERWILIS",
      data: nerwilisData,
      backgroundColor: randomRGB(),
    },
    {
      label: "IPDS",
      data: ipdsData,
      backgroundColor: randomRGB(),
    },
    {
      label: "TU",
      data: tuData,
      backgroundColor: randomRGB(),
    },
  ];

  return {
    labels,
    datasets,
  };
};

const generateDataPartners = (data: any) => {
  const labels: string[] = data.map((item: any) => item.period);

  const partnerData: number[] = data.map((item: any) => item.partners.length);

  const datasets = [
    {
      label: "Mitra",
      data: partnerData,
      backgroundColor: randomRGB(),
    },
  ];

  return {
    labels,
    datasets,
  };
};

const generateDataActivities = (data: any) => {
  const labels: string[] = data.map((item: any) => item.period);

  const activitiesData: number[] = data.map(
    (item: any) => item.activities.length
  );

  const datasets = [
    {
      label: "Kegiatan",
      data: activitiesData,
      backgroundColor: randomRGB(),
    },
  ];

  return {
    labels,
    datasets,
  };
};

const fetchData = async () => {
  try {
    load.value = false;
    const data = await getContractStatistic();

    dataByStatus.value = generateDataByStatus(data);
    dataByTeam.value = generateDataByTeam(data);
    dataPartners.value = generateDataPartners(data);
    dataActivities.value = generateDataActivities(data);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
  } finally {
    load.value = true;
  }
};

onMounted(async () => {
  await fetchData();
});
</script>
