FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js -poly
TARGETDIR=./faust
ASSETDIR=../assets/faust
FILES=	$(TARGETDIR)/eks.html \
	$(TARGETDIR)/ks.html \
	$(TARGETDIR)/sitar.html \
	$(TARGETDIR)/elecGuitar.html \
	$(TARGETDIR)/nylonGuitar.html \
	$(TARGETDIR)/steelGuitar.html \
	$(TARGETDIR)/bass.html

FILES=	$(TARGETDIR)/eks.html


$(TARGETDIR)/%.html: ./src/%.dsp
	$(FAUSTWASM) $< $(TARGETDIR)

all:: $(FILES)
	mkdir -p $(ASSETDIR) 
	mv $(TARGETDIR)/*.wasm $(TARGETDIR)/*.json $(ASSETDIR)
	rm -fr $(TARGETDIR)

clean:: ; rm -rf $(ASSETDIR)/*

echo:: ; echo $(FILES)
