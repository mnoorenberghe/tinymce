import { SugarElement } from '@ephox/sugar';
import { isElementBottomAligned, isElementTopAligned } from '../../api/behaviour/PositionUtils';
import { nu as NuSpotInfo } from '../view/SpotInfo';
import { Bubble } from './Bubble';
import * as Direction from './Direction';
import { boundsRestriction } from './LayoutBounds';
import { LayoutLabels } from './LayoutLabels';
import { AnchorBox, AnchorElement, AnchorLayout } from './LayoutTypes';

const constrainedTopY = (anchor: AnchorBox, element: AnchorElement) => {
  return anchor.y - element.height;
};

const constrainedBottomY = (anchor: AnchorBox) => {
  return anchor.y + anchor.height;
};

const middleX = (anchor: AnchorBox, element: AnchorElement) => {
  return anchor.x + anchor.width / 2 - element.width / 2;
};

const pinAtTop: AnchorLayout = (
  anchor: AnchorBox,
  element: AnchorElement,
  bubbles: Bubble
) => {
  return NuSpotInfo(
    // cap the bounds.
    middleX(anchor, element),
    constrainedTopY(anchor, element),
    bubbles.north(),
    Direction.north(),
    boundsRestriction(anchor, {}),
    LayoutLabels.northPinned,
    true
  );
};

const pinAtBottom: AnchorLayout = (
  anchor: AnchorBox,
  element: AnchorElement,
  bubbles: Bubble
) => {
  return NuSpotInfo(
    // cap the bounds.
    middleX(anchor, element),
    constrainedBottomY(anchor),
    bubbles.south(),
    Direction.south(),
    boundsRestriction(anchor, {}),
    LayoutLabels.southPinned,
    true
  );
};

const contextualPinnedOrder = (element: SugarElement<any>, whenAtTop: () => AnchorLayout[], whenAtBottom: () => AnchorLayout[], whenDefault: () => AnchorLayout[], moveAwayFrom: string): AnchorLayout[] => {
  if (isElementTopAligned(element)) {
    return moveAwayFrom === 'top' ? whenAtBottom() : whenAtTop();
  } else if (isElementBottomAligned(element)) {
    return moveAwayFrom === 'bottom' ? whenAtTop() : whenAtBottom();
  } else {
    return whenDefault();
  }
};

export {
  pinAtTop,
  pinAtBottom,
  contextualPinnedOrder
};
