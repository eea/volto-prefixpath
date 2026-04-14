import EditHeroImageLeftBlock from './Edit';
import ViewHeroImageLeftBlock from './View';
import blocksSchema from './schema';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import heroSVG from '@plone/volto/icons/hero.svg';

export default function applyConfig(config) {
  config.blocks.blocksConfig.hero = {
    id: 'hero',
    title: 'Hero',
    icon: heroSVG,
    group: 'common',
    view: ViewHeroImageLeftBlock,
    edit: EditHeroImageLeftBlock,
    schema: BlockSettingsSchema,
    blockSchema: blocksSchema,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
  };
  return config;
}
