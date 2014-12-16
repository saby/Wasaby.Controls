#
# The Python Imaging Library
# $Id$
#
# WMF stub codec
#
# history:
# 1996-12-14 fl   Created
# 2004-02-22 fl   Turned into a stub driver
# 2004-02-23 fl   Added EMF support
#
# Copyright (c) Secret Labs AB 1997-2004.  All rights reserved.
# Copyright (c) Fredrik Lundh 1996.
#
# See the README file for information on usage and redistribution.
#

__version__ = "0.2"

from . import Image, ImageFile

_handler = None

##
# Install application-specific WMF image handler.
#
# @param handler Handler object.

def register_handler(handler):
    global _handler
    _handler = handler

if hasattr(Image.core, "drawwmf"):
    # install default handler (windows only)

    class WmfHandler:

        def open(self, im):
            im.mode = "RGB"
            self.bbox = im.info["wmf_bbox"]

        def load(self, im):
            im.fp.seek(0) # rewind
            return Image.frombytes(
                "RGB", im.size,
                Image.core.drawwmf(im.fp.read(), im.size, self.bbox),
                "raw", "BGR", (im.size[0]*3 + 3) & -4, -1
                )

    register_handler(WmfHandler())

# --------------------------------------------------------------------

def word(c, o=0):
    return c[o] + (c[o+1] << 8)

def short(c, o=0):
    v = c[o] + (c[o+1] <<8)
    if v >= 32768:
        v = v - 65536
    return v

def dword(c, o=0):
    return c[o] + (c[o+1] << 8) + (c[o+2] << 16) + (c[o+3] << 24)

def int(c, o=0):
    return dword(c, o)

#
# --------------------------------------------------------------------
# Read WMF file

def _accept(prefix):
    return (
        prefix[:6] == b"\xd7\xcd\xc6\x9a\x00\x00" or
        prefix[:4] == b"\x01\x00\x00\x00"
        )

##
# Image plugin for Windows metafiles.

class WmfStubImageFile(ImageFile.StubImageFile):

    format = "WMF"
    format_description = "Windows Metafile"

    def _open(self):

        # check placable header
        s = self.fp.read(80)

        if s[:6] == b"\xd7\xcd\xc6\x9a\x00\x00":

            # placeable windows metafile

            # get units per inch
            inch = word(s, 14)

            # get bounding box
            x0 = short(s, 6); y0 = short(s, 8)
            x1 = short(s, 10); y1 = short(s, 12)

            # normalize size to 72 dots per inch
            size = (x1 - x0) * 72 // inch, (y1 - y0) * 72 // inch

            self.info["wmf_bbox"] = x0, y0, x1, y1

            self.info["dpi"] = 72

            # print self.mode, self.size, self.info

            # sanity check (standard metafile header)
            if s[22:26] != b"\x01\x00\t\x00":
                raise SyntaxError("Unsupported WMF file format")

        elif int(s) == 1 and s[40:44] == b" EMF":
            # enhanced metafile

            # get bounding box
            x0 = int(s, 8); y0 = int(s, 12)
            x1 = int(s, 16); y1 = int(s, 20)

            # get frame (in 0.01 millimeter units)
            frame = int(s, 24), int(s, 28), int(s, 32), int(s, 36)

            # normalize size to 72 dots per inch
            size = x1 - x0, y1 - y0

            # calculate dots per inch from bbox and frame
            xdpi = 2540 * (x1 - y0) // (frame[2] - frame[0])
            ydpi = 2540 * (y1 - y0) // (frame[3] - frame[1])

            self.info["wmf_bbox"] = x0, y0, x1, y1

            if xdpi == ydpi:
                self.info["dpi"] = xdpi
            else:
                self.info["dpi"] = xdpi, ydpi

        else:
            raise SyntaxError("Unsupported file format")

        self.mode = "RGB"
        self.size = size

        loader = self._load()
        if loader:
            loader.open(self)

    def _load(self):
        return _handler


def _save(im, fp, filename):
    if _handler is None or not hasattr("_handler", "save"):
        raise IOError("WMF save handler not installed")
    _handler.save(im, fp, filename)

#
# --------------------------------------------------------------------
# Registry stuff

Image.register_open(WmfStubImageFile.format, WmfStubImageFile, _accept)
Image.register_save(WmfStubImageFile.format, _save)

Image.register_extension(WmfStubImageFile.format, ".wmf")
Image.register_extension(WmfStubImageFile.format, ".emf")
