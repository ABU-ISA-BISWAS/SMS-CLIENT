import { Navigation } from "../models/navigation.model"; 

export class NavigationSerializer {

    fromJson(json: any): Navigation {
        const navigation = new Navigation();

        navigation.displayName = json.displayName;
        navigation.route = json.route;
        navigation.iconName = json.iconName;
        navigation.children = json.children;

        return navigation;
    }

    toJson(navigation: Navigation): any {
        return {
            displayName: navigation.displayName,
            route: navigation.route,
            iconName: navigation.iconName,
            children: navigation.children
        };
    }
}
