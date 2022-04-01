## Smart search

la ricerca intelligente permette di ricercare menzioni con gli spazi e di fermare la ricerca quando non ci sono risulati, quindi di continuare a scrivere senza effettuare ricerche che potrebbero a 0 risultati e di riprendere la ricerca al momento giusto

es:

```js
mentions: [
  "@test",
  "@testent",
  "@mention"
]
```

#### caso numero 1: risultati trovati

```
risultati:
-> @test
-> @testnet
====== input text
hello @te
======
```

#### caso numero 2: zero risultati al terzo carattere

in questo caso non ci sarebbero risultati quindi stoppo la ricerca perché inutile e la riprendo solamente dopo aver cancellato la `d` da @ted

```
====== input text
hello @ted another text
======
```

## Come funziona la ricerca intelligente?

Si salvano delle "parti di ricerca" con un inizio (che corrisponde al carattere speciale) e una fine (che corrisponde a quando l'API non ritorna piu risultati)

in questo modo è possibile sapere quando il cursore entra nell'aera della ricerca per riabilitare la ricerca tramite API

## Quale è il tipo di queste "parti di ricerca"?

```js
export type SearchCursorPosition = {
  uuid: string;
  start: number;
  end: number;
  pauseAt?: number;
  type: string;
};
```

| Nome | Descrizione |
| - | - |
| uuid | identifica la parte di ricerca |
| start | punto di inizio |
| end | punto di fine che cambia ogni volta che uno o piu caratteri vengono aggiunti o rimossi |
| pauseAt | punto in cui la ricerca si ferma (zero risultati) |
| type | il tipo di oggetto da menzionare |

## Smart search disattivata

la ricerca rimarrà attiva finche l'utente non preme la `X` per chiudere la mention quindi in questo caso:

```
====== input text
hello @ted another text
======
```

verrà richiamata la props: `searchMentionableItems` passando il testo di ricerca con: `ted another text` e ogni carattere che verrà inserito o cancellato comunque la ricerca partirà