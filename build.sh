#!/usr/bin/env bash
#
# This package extends core Ext files. To build successfully the following changes need to be made:
#
# package.json
#   - set toolkit to "classic"
#   - set framework to "ext"
#
# When building:
#   $ sencha config -prop skip.sass=1 then package build
#
set -e

sencha config -prop skip.sass=1 then package build