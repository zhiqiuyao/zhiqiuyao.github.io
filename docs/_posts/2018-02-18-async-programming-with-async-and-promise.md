---
title:  "使用 Promise、Async/Await组合来更好的异步编程"
description: "在 Async/Await 大行其道的今天，是否还有 Promise 的用武之地？答案是肯定的"
date:  Sat Feb 17 2020 17:21:40 GMT+0800 (CST)
tags: js
---

Async/Await 语法使得编写异步代码易读、易写。但我们仍然在某些场景需要使用到`Promise.all()`。假设我们实现“根据书名获取它的作者和评分”的逻辑。
```js
const getBook = async bookName => {
    const book = await fetchBook();

    const author = await fetchAuthor(book.authorId);
    const rating = await fetchRating(book.id);

    return {
        ...book,
        author,
        rating
    };
};

getBook('JavaScript语言精粹');
```

上面的代码看起来非常整洁，但执行起来情况如何呢？

*   fetchBook: 1 s
*   fetchAuthor: 1 s
*   fetchRating: 1 s
*   Total: 3 s

由于`fetchBook`->`fetchAuthor`->`fetchRating`的串行请求，不难发现上面的代码执行起来有些耗时。
`fetchAuthor`和`fetchRating`两个函数应该并行请求，来达到最少耗时。

```js
const getBook = async bookName => {
    const book = await fetchBook(bookName);

    return Promise.all([
        fetchAuthor(book.authorId),
        fetchRating(book.id)
    ]).then(results => {
        return {
            ...book,
            author: results[0],
            rating: results[1]
        };
    });
};
```

现在获取作者和评分并行进行了，请求耗时：

*   fetchBook: 1 s
*   (fetchAuthor/fetchRating): 1 s
*   Total: 2 sec

此时代码仍然有优化空间

```js
const getBook = async bookName => {
    const book = await fetchBook(bookName);

    const [author, rating] = await Promise.all([
        fetchAuthor(book.authorId),
        fetchRating(book.id)
    ]);

    return {
        ...book,
        author,
        rating
    };
};
```

看！我们使用`Promise.all()`和数组的`解构`特性对第一版代码的性能、可读性进行了提高。