import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Test } from "../components/test";
import './stories.css'

export default {
  title: "Test",
  component: Test,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Test>;

const Template: ComponentStory<typeof Test> = () => <Test />;

export const LoggedOut = Template.bind({});
