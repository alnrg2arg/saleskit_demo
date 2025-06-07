import { Layers1 } from ".";

export default {
  title: "Components/Layers1",
  component: Layers1,

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
