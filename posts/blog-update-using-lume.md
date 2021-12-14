---
title: Website update using Lume and Deno
description: I updated my blog to use Deno and Lume to have more fammiliarity with the underlying infrastructure compard to Jekyll.
tags:
  - Lume
  - Deno
  - Blog update
---

## Intro

Two weeks ago I decided to update my personal website as part of an endeavour to
improve my self-promotion. As I stared working on the things I wanted to build I
quickly understood that most of the Jekyll plugins and custom code I used to
previously build the site are now largely incompatible with the new versions of
Jekyll and Ruby. As I am far from a Ruby expert I decided to move my website to
a familiar technology such as Gatsby or Next.JS as part of the process. But
since I have been experimenting with [Deno](https://deno.land/) and
[Deno Deploy](https://deno.com/deploy) I decided to search for a static site
generator built with Deno and my search quickly lead me to find
[Lume](https://lumeland.github.io/).

## Why Deno and Lume

The choice of using Deno over Node.JS for something simple and light weight was
obvious to me since in scope of my personal website I do not have any strong
requirements in terms of runtime maturity or having a vibrant (sometimes too
vibrant) echosystem of packages such as the one provided by npm. Additionally
Deno is super simple to set up and keep up to date.

Lets go over some key advantages of [Deno](https://deno.land/):

- First class TypeScript support
- Ability to use deno fmt instead of configuring eslint (but both are possible)
- No need for babel with most latest ES6 features supported out of the box,
  including ES6 modules and top-level async/await.
- A secure sandbox runtime environment which requires to explicitly set access
  permissions depending on the applications needs.
- Easy integration with WebAssembly and Rust modules.

Reasons for using [Lume](https://lumeland.github.io/) for a simple static site:

- Blazing fast ⚡
- Works similarly to Jekyll and Gatsby but runs on Deno
- Supports all of the most popular file and template formats
- Super simple setup and configuration allowing you to enable only what you need
  for your site.
- Heavily customizable using Scripts, Events, Processors, Loaders, and Plugins.

Setting up a website with Lume was very easy, but after I looked at examples I
decided to use their [Base Blog starter](https://github.com/lumeland/base-blog)
as a baseline. It was a smooth starting point with clear instructions on how to
deploy the site to GitHub pages using GitHub actions which is exactly what I
wanted.

I even set up a [simple event hook](https://lumeland.github.io/core/events/)
that allowed me to generate a `.pdf` version of my CV from it's markdown page
using puppeteer, so when I edit the CV page a new version of the `pdf` is
generated on the fly.

The source code of my website which you are currently reading can be found
[here](https://github.com/denissb/denissb.github.io) in case you want to have a
look. :wink:

Happy hacking! 🕊
