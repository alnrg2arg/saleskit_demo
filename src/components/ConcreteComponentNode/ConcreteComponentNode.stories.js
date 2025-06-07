import { ConcreteComponentNode } from ".";

export default {
  title: "Components/ConcreteComponentNode",
  component: ConcreteComponentNode,

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
