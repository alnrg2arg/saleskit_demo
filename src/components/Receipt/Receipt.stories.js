import { Receipt } from ".";

export default {
  title: "Components/Receipt",
  component: Receipt,

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
