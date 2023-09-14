import { MenuItem } from 'primeng/api';

export interface AppMenuItems {
    getAppMenuItems(DialogService): MenuItem[];
}