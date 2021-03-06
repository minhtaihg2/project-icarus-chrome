// @flow
import { observable, action } from 'mobx';
import Store from './lib/Store';
import resolver from '../utils/imports';
import environment from '../environment';

const sidebarConfig = resolver('config/sidebarConfig');

export default class SidebarStore extends Store {

  CATEGORIES = sidebarConfig.CATEGORIES;

  @observable activeSidebarCategory: string = this.CATEGORIES[0].route;

  setup() {
    const actions = this.actions.sidebar;
    actions.activateSidebarCategory.listen(this._onActivateSidebarCategory);
    actions.walletSelected.listen(this._onWalletSelected);
    this.registerReactions([
      this._syncSidebarRouteWithRouter,
    ]);
  }

  @action _onActivateSidebarCategory = (params: { category: string, }) => {
    const { category } = params;
    if (category !== this.activeSidebarCategory) {
      this.activeSidebarCategory = category;
      this.actions.router.goToRoute.trigger({ route: category });
    }
  };

  @action _onWalletSelected = ({ walletId }: { walletId: string }) => {
    this.stores[environment.API].wallets.goToWalletRoute(walletId);
  };

  @action _setActivateSidebarCategory = (category: string) => {
    this.activeSidebarCategory = category;
  };

  _syncSidebarRouteWithRouter = () => {
    const route = this.stores.app.currentRoute;
    this.CATEGORIES.forEach((category) => {
      // If the current route starts with the root of the category
      if (route.indexOf(category.route) === 0) this._setActivateSidebarCategory(category.route);
    });
  };
}
