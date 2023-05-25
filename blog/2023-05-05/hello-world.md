<!--
description: Summary of the experience and hurdles of coding this blog.
tags: buildintheopen, meta, coding, vite, ts
-->

# Hello, World!

This is how I built this blog, or at least the first iteration of it. So please ride along on this journey of sweet success and sorrowful cryptic error messages.
But first let me vent out on my frustrations on modern front-end tooling...

## #rant

I know that vite is amazing and helps in getting a nice and optimized project all the way and having a "no build" development environment is really refreshing and is lovely to work on but I still hate that I’m required to have a build step when generating my files that is for sure a good idea for big projects full of small files and libraries but I’d still like to have the option to opt out of bundling just to have a website that is readable by people and a good place to learn even though it is not as optimal so to be honest I hate to be locked up and have to get out of my way to deal with rollup shenanigans instead of just compiling typescript and be done with it.

Okay, #rant over, back to the post.

## The why

I was talking to a friend about building in the open and decided it would be a good idea to show my skills and thought process. But first I had to decide how to get the content out and where to put it.
One idea was to use a hosting service like [dev.to](https://dev.to/) or [WordPress](https://wordpress.org/) and hook my website to it, but I already have a static site and like to keep things as simple for people accessing it as it can be.

So, that meant:
1. Use the existing infrastructure
2. No front-end frameworks (to keep things simple, it has static data only after all)
3. Has to integrate well with vite
4. I can build it myself if no tools already exist

## The how

My investigation began, as usual, with typing "vite blog plugin" on Bing and Google and seeing what that lead me.
Unfortunately there were no existing plugins for that. The only option was [VitePress](https://vitepress.dev/), it is a good one but when I tried it was doing too much magic and altering the existing project a lot, so not a "plugin" and more of a "full featured system built _on top of_ vite".

That meant I was about to build a plugin or at least write _some_ code myself.

The investigation followed with some MPA (Multi-page application) plugins for vite. As it was born from the Vue community it's main porpouse is to build SPAs (Single-page applications) and it's not the best at building MPAs, but it can be done. The one that cought my attention was [`vite-plugin-virtual-mpa`](https://github.com/emosheeep/vite-plugin-virtual-mpa/). I configured it, wrote a lot of code and then went to test...

BOOM! Cryptic errors showed up.

## The errors

The error was:
```
RollupError: The "fileName" or "name" properties of emitted files must be strings that are neither absolute nor relative paths, received <PATH_TO_FILE>
```

I tried to investigate what was causing it, and to keep a 4 hours of frustration story short, vite uses rollup internally and to build a MPA we have to pass in the `input` configuration to it so it can find the files and build them. The plugin was generating the files on the dev server but when it came time to build, rollup was not able to find them because they were never created _on disk_, they were only _virtual_.

## The (failed) atempt

I then dug into the source code for `vite-plugin-virtual-mpa` and tried to create the minimal steps to reproduce the bug.

The trial and error approach didn't help as the problem was too intrenched in the plugin's code and I was not able to find a way to fix it. But after taking a step back it clicked to me: _what if I created the files and the input configuration "by hand" and injected it on the `src` folder then let vite deal with the build part?_

## The solution

This time I tried the minimal approach first to find bugs and was able to build a working version in a couple of hours. Much of the logic was reused from the plugin fix attempt, I just had to literally write the files on disc and find a way to structure the logic.

So, the "plugin" does the following steps:
1. Walk the `blog` folder and find all the `.md` files
2. Extract the metadata from the files
	a. The folder name is the date (e.g. `blog/2023-05-05/hello-world.md` is from May 5th, 2023)
	b. The file name is the slug (e.g. `blog/2023-05-05/hello-world.md` is `hello-world`)
	c. The first header on the file is the title (e.g. `# Hello, World!` is the title)
	d. The first html comment is the metadata with some fields like `description` and `tags` (e.g. `<!-- description: Summary of the experience and hurdles of coding this blog. -->`)
3. Create a file structure on the `src` folder with templates for each page and the extracted metadata
4. Export a list of files to be injected by vite and rollup
5. Let vite do it's ✨ magic ✨
6. Profit

## The result

The result is this blog that you, dear reader, is reading right now. It is not perfect, but it is a good MVP to be up and running and improve as I go.

The code can be viewed on github on the [`blog.ts`](https://github.com/madcampos/madcampos.github.io/blob/main/build/blog.ts).

## Next steps
There sre still some point to improve, the next ones I intend to tackle are the styling of the blog that is pretty barebones and pagination.
But those are for future posts.