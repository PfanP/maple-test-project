import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from "./layouts/main_layout";
import Home from "../imports/ui/containers/home";

FlowRouter.route('/', {
    action() {
        mount(MainLayout, {
            component: (<Home/>)
        })
    },
    name: "Home"
});