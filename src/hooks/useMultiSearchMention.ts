import { useCallback, useMemo, useState } from 'react';
import {
  generateUUID,
  isCursorIsBetweenSearchMention,
  shiftSearchCursorIfNeeded,
} from '../helper';
import { CursorPosition, SearchCursorPosition, Typing } from '../types';

type Props = {
  closeMention: any;
};

const useMultiSearchMention = (props: Props) => {
  const { closeMention } = props;

  // uuid of searchMention actived
  const [searchMentionHoverUUID, setSearchMentionHoverUUID] = useState<
    string | undefined
  >(undefined);

  // all search position
  const [searchMentionPositions, refreshSearchMentionPositions] = useState<
    SearchCursorPosition[]
  >([]);

  // current search mention actived
  const searchMentionHovering = useMemo(
    () =>
      searchMentionPositions.find(
        (searchMentionPosition) =>
          searchMentionPosition.uuid === searchMentionHoverUUID
      ),
    [searchMentionPositions, searchMentionHoverUUID]
  );

  const removeAllSearchMentionPosition = useCallback(() => {
    refreshSearchMentionPositions([]);
  }, []);
  const removeSearchMentionPosition = useCallback(
    (uuid: string) => {
      refreshSearchMentionPositions(
        searchMentionPositions.filter(
          (searchMentionPosition) => searchMentionPosition.uuid !== uuid
        )
      );
    },
    [searchMentionPositions]
  );
  const pauseSearchMentionPosition = useCallback(
    (uuid: string) => {
      refreshSearchMentionPositions(
        searchMentionPositions.map((searchMentionPosition) => {
          if (searchMentionPosition.uuid === uuid) {
            return {
              ...searchMentionPosition,
              pauseAt: searchMentionPosition.end,
            };
          } else {
            return searchMentionPosition;
          }
        })
      );
    },
    [searchMentionPositions]
  );
  const addSearchMentionPosition = useCallback(
    (cursor: CursorPosition, type: string) => {
      const uuid = generateUUID();
      refreshSearchMentionPositions([
        ...searchMentionPositions,
        { uuid, ...cursor, type },
      ]);

      setSearchMentionHoverUUID(uuid);
    },
    [searchMentionPositions]
  );

  const manageSearchMentionPosition = useCallback(
    (
      cursor: CursorPosition, // start and end of edit
      oldText: string,
      newText: string,
      typing: Typing
    ): SearchCursorPosition | undefined => {
      let searchPositionFound: SearchCursorPosition | undefined;
      const newSearchMentionPositions = searchMentionPositions
        .map((searchMentionPosition) => {
          const searchMentionPositionShifted = shiftSearchCursorIfNeeded(
            cursor,
            searchMentionPosition,
            oldText,
            newText,
            typing
          );
          return searchMentionPositionShifted;
        })
        .map((searchMentionPosition) => {
          if (searchMentionPosition) {
            if (isCursorIsBetweenSearchMention(cursor, searchMentionPosition)) {
              setSearchMentionHoverUUID(searchMentionPosition.uuid);
              searchPositionFound = {
                ...searchMentionPosition,
                end:
                  typing === Typing.addedText
                    ? Math.max(cursor.end, searchMentionPosition.end)
                    : Math.min(cursor.end, searchMentionPosition.end),
                pauseAt: undefined,
              };
              return searchPositionFound;
            } else {
              return searchMentionPosition;
            }
          } else {
            return undefined;
          }
        })
        .filter((searchMentionPosition) => {
          if (!searchMentionPosition) {
            // if user added or removed some text into mention char trigger
            closeMention();
            return false;
          }
          return true;
        });

      refreshSearchMentionPositions(
        newSearchMentionPositions as SearchCursorPosition[]
      );

      return searchPositionFound;
    },
    [
      searchMentionPositions,
      closeMention,
      refreshSearchMentionPositions,
      setSearchMentionHoverUUID,
    ]
  );
  const getSearchMentionFromCursor = useCallback(
    (cursor: CursorPosition) =>
      searchMentionPositions.find((searchMentionPosition) =>
        isCursorIsBetweenSearchMention(cursor, searchMentionPosition)
      ),
    [searchMentionPositions]
  );

  return {
    searchMentionPositions,
    setSearchMentionHoverUUID,
    searchMentionHovering,
    pauseSearchMentionPosition,
    manageSearchMentionPosition,
    getSearchMentionFromCursor,
    removeSearchMentionPosition,
    addSearchMentionPosition,
    removeAllSearchMentionPosition,
  };
};

export default useMultiSearchMention;
