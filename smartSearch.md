## Smart search

Additional feature that let to search mentions with spaces among words. It also add the capacility to stop the search when zero results are found, therefore prevent to search something that won't match.

Eg:

```js
mentions: [
  "@test",
  "@testent",
  "@mention"
]
```

#### Case 1: some results found

Results:
```
-> @test
-> @testnet
====== input text
hello @te
======
```

#### Case 2: Zero results after third char

Since there aren't result the search is stopped and resumed only after the char `d`is deleted.

```
====== input text
hello @ted another text
======
```

## How it works?

There are saved "parts of research", which are substring with a starting char (mention tag) and ending point (when no results are found).

Looping through these parts of research I am able to detect when the search has to be enabled again.
#### Type

```js
export type SearchCursorPosition = {
  uuid: string; // Unique identifier
  start: number; // Starting point
  end: number; // Ending point, updated every time chars are added or removed
  pauseAt?: number; // Point where search is stopped (zero results)
  type: string; // Mention type
};
```
## Smart search off (default beahviour)

Search will be enabled till the user press **CLOSE** and every char typed will throw the search method.