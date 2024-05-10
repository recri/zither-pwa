FAUSTWASM= node ../../faustwasm/scripts/faust2wasm.js -poly
TARGETDIR=../src/faust
ASSETDIR=../assets/faust
OUTTSCDIR=../out-tsc/src/faust
FILES=	$(TARGETDIR)/eks.html \
	$(TARGETDIR)/ks.html \
	$(TARGETDIR)/sitar.html \
	$(TARGETDIR)/elecGuitar.html \
	$(TARGETDIR)/nylonGuitar.html \
	$(TARGETDIR)/steelGuitar.html \
	$(TARGETDIR)/bass.html

$(TARGETDIR)/%.html: %.dsp
	$(FAUSTWASM) $< $(TARGETDIR)

all:: clean
	for f in `$(MAKE) -silent echo`; do $(MAKE) $$f; done
	mv $(TARGETDIR)/*.wasm $(TARGETDIR)/*.json $(ASSETDIR)
	rm $(TARGETDIR)/*.js $(TARGETDIR)/*.html
	# my server chokes on the delivered index.js
	cp index.xx $(TARGETDIR)/faustwasm/index.js
	# the typescript compiler complains about a type
	cp index.d.xx $(TARGETDIR)/faustwasm/index.d.ts
	# the typescript compiler doesn't copy this
	rsync -av $(TARGETDIR)/ $(OUTTSCDIR)/

clean:: ; rm -rf $(TARGETDIR)/* $(ASSETDIR)/*

echo:: ; echo $(FILES)
