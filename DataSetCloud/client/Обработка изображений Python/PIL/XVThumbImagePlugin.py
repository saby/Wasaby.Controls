#
# The Python Imaging Library.
# $Id$
#
# XV Thumbnail file handler by Charles E. "Gene" Cash
# (gcash@magicnet.net)
#
# see xvcolor.c and xvbrowse.c in the sources to John Bradley's XV,
# available from ftp://ftp.cis.upenn.edu/pub/xv/
#
# history:
# 98-08-15 cec  created (b/w only)
# 98-12-09 cec  added color palette
# 98-12-28 fl   added to PIL (with only a few very minor modifications)
#
# To do:
# FIXME: make save work (this requires quantization support)
#

__version__ = "0.1"

from . import Image, ImageFile, ImagePalette

# standard color palette for thumbnails (RGB332)
PALETTE = b""
for r in range(8):
    for g in range(8):
        for b in range(4):
            PALETTE += bytes((
                (r * 255) // 7,
                (g * 255) // 7,
                (b * 255) // 3))

##
# Image plugin for XV thumbnail images.

class XVThumbImageFile(ImageFile.ImageFile):

    format = "XVThumb"
    format_description = "XV thumbnail image"

    def _open(self):

        # check magic
        s = self.fp.read(6)
        if s != b"P7 332":
            raise SyntaxError("not an XV thumbnail file")

        # skip info comments
        while 1:
            s = self.fp.readline().strip()
            if s == b"#END_OF_COMMENTS":
                break

        # read header line
        s = self.fp.readline().split()

        self.mode = "P"
        self.size = int(s[0]), int(s[1])

        self.palette = ImagePalette.raw("RGB", PALETTE)

        self.tile = [
            ("raw", (0, 0)+self.size,
             self.fp.tell(), (self.mode, 0, 1)
             )]

# --------------------------------------------------------------------

Image.register_open("XVThumb", XVThumbImageFile)
