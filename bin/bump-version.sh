#!/usr/bin/env bash

set -e

if [ $# -lt 1 ]; then
	echo "usage: $0 <version>"
	exit 1
fi

version=$1

# Stable tag should only track stable releases, not prereleases.
if ! echo "${version}" | grep -qE "alpha|beta|RC|rc"; then
	sed -i.bak -e "s/^Stable tag:.*/Stable tag:        ${version}/" README.md
	rm README.md.bak
fi

sed -i.bak -e "s/^ \* Version: .*/ * Version: ${version}/" inline-typography-controls.php
rm inline-typography-controls.php.bak
