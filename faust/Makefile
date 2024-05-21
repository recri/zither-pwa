FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js -poly
SRCDIR=./src
TMPDIR=./tmp
# some of the results go into /assets 
# so they can be fetch()'ed at an absolute path
# both in the test server and the final build
ASSETDIR=../assets/faust
# some of the results go into the typescript output tree
# so they can be import'ed by other source modules and
# found for postprocessing into the rolled up dist.
OUTTSCDIR=../out-tsc/src/faust
# the files
FILES=	$(TMPDIR)/eks.html \
	$(TMPDIR)/ks.html \
	$(TMPDIR)/sitar.html \
	$(TMPDIR)/elecGuitar.html \
	$(TMPDIR)/nylonGuitar.html \
	$(TMPDIR)/steelGuitar.html \
	$(TMPDIR)/bass.html

$(TMPDIR)/%.html: $(SRCDIR)/%.dsp
	$(FAUSTWASM) $< $(TMPDIR)

all:: $(FILES)

install:: all
	mv $(TMPDIR)/*.wasm $(TMPDIR)/*.json $(ASSETDIR)
	rm $(TMPDIR)/*.js $(TMPDIR)/*.html
	# my server chokes on the delivered index.js
	cp $(SRCDIR)/index.xx $(TMPDIR)/faustwasm/index.js
	# the typescript compiler complains about a type
	cp $(SRCDIR)/index.d.xx $(TMPDIR)/faustwasm/index.d.ts
	# the typescript compiler doesn't copy this
	rsync -av $(TMPDIR)/ $(OUTTSCDIR)/

clean:: ; rm -rf $(TMPDIR)/* $(ASSETDIR)/*

