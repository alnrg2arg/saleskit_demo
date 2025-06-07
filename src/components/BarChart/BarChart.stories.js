import { BarChart } from ".";

export default {
  title: "Components/BarChart",
  component: BarChart,

  argTypes: {
    variant: {
      options: ["sharp", "filled", "outline"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    variant: "sharp",
  },
};
