#
# The Python Imaging Library
# $Id$
#
# bitmap distribution font (bdf) file parser
#
# history:
# 1996-05-16 fl   created (as bdf2pil)
# 1997-08-25 fl   converted to FontFile driver
# 2001-05-25 fl   removed bogus __init__ call
# 2002-11-20 fl   robustification (from Kevin Cazabon, Dmitry Vasiliev)
# 2003-04-22 fl   more robustification (from Graham Dumpleton)
#
# Copyright (c) 1997-2003 by Secret Labs AB.
# Copyright (c) 1997-2003 by Fredrik Lundh.
#
# See the README file for information on usage and redistribution.
#

from . import Image
from . import FontFile

# --------------------------------------------------------------------
# parse X Bitmap Distribution Format (BDF)
# --------------------------------------------------------------------

bdf_slant = {
   b"R": b"Roman",
   b"I": b"Italic",
   b"O": b"Oblique",
   b"RI": b"Reverse Italic",
   b"RO": b"Reverse Oblique",
   b"OT": b"Other"
}

bdf_spacing = {
    b"P": b"Proportional",
    b"M": b"Monospaced",
    b"C": b"Cell"
}

def bdf_char(f):

    # skip to STARTCHAR
    while 1:
        s = f.readline()
        if not s:
            return None
        if s[:9] == b"STARTCHAR":
            break
    id = s[9:].strip()

    # load symbol properties
    props = {}
    while 1:
        s = f.readline()
        if not s or s[:6] == b"BITMAP":
            break
        i = s.find(b" ")
        props[s[:i]] = s[i+1:-1]

    # load bitmap
    bitmap = []
    while 1:
        s = f.readline()
        if not s or s[:7] == b"ENDCHAR":
            break
        bitmap.append(s[:-1])
    bitmap = b"".join(bitmap)

    [x, y, l, d] = list(map(int, props[b"BBX"].split()))
    [dx, dy] = list(map(int, props[b"DWIDTH"].split()))

    bbox = (dx, dy), (l, -d-y, x+l, -d), (0, 0, x, y)

    try:
        im = Image.frombytes("1", (x, y), bitmap, "hex", "1")
    except ValueError:
        # deal with zero-width characters
        im = Image.new("1", (x, y))

    return id, int(props[b"ENCODING"]), bbox, im

##
# Font file plugin for the X11 BDF format.

class BdfFontFile(FontFile.FontFile):

    def __init__(self, fp):

        FontFile.FontFile.__init__(self)

        s = fp.readline()
        if s[:13] != b"STARTFONT 2.1":
            raise SyntaxError("not a valid BDF file")

        props = {}
        comments = []

        while 1:
            s = fp.readline()
            if not s or s[:13] == b"ENDPROPERTIES":
                break
            i = s.find(b" ")
            props[s[:i]] = s[i+1:-1]
            if s[:i] in [b"COMMENT", b"COPYRIGHT"]:
                if s.find(b"LogicalFontDescription") < 0:
                    comments.append(s[i+1:-1])

        font = props[b"FONT"].split(b"-")

        font[4] = bdf_slant[font[4].upper()]
        font[11] = bdf_spacing[font[11].upper()]

        ascent = int(props[b"FONT_ASCENT"])
        descent = int(props[b"FONT_DESCENT"])

        fontname = b";".join(font[1:])

        # print "#", fontname
        # for i in comments:
        #       print "#", i

        font = []
        while 1:
            c = bdf_char(fp)
            if not c:
                break
            id, ch, (xy, dst, src), im = c
            if ch >= 0 and ch < len(self.glyph):
                self.glyph[ch] = xy, dst, src, im
