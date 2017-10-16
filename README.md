# Themr

Theming demo for Firefox Quantum and beyond. 

## Get Started

1. Clone or download the repository
2. In Firefox 57 + open `about:debugging` and load the `mainfest.json` file.
3. Firefox' theme will change and you'll see a paintbrush icon on your toolbar.

## Caveats on Theming

It is my contention that there are a few issues with Lightweight Themes in FF Quantum that should be resolved.

1. Themes enforce an ugly dropshadow on tab text if color contrast is not far enough apart.
2. The leftmost tab border has odd styling from a placeholder element that does not change if the first tab is focused.
3. The accent color on active tabs is the same as the background color on the tab strip.

In order to rectify issue 1 and partly rectify issue 2, I've added a `userChrome.css` file to my Firefox profile with the following: 

```
@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");

.tabbrowser-tab { 
  text-shadow: none !important; 
}

.titlebar-placeholder[type="pre-tabs"] {
  border-inline-end: 1px solid var(--tabs-border) !important;
  opacity: 1 !important;
}

.tab-icon-sound {
  filter: none !important;
}
```

If you'd like to create a `userChrome.css` file you can do so by finding your Firefox profile, making a directory called `chrome` and in it, a file called `userChrome.css`. Pasting the above CSS and restarting Firefox will make your world nicer as you demo this webExtension.


