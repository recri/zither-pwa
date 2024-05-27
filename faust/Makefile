FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js -poly
TARGETDIR=./tmp
SOURCEDIR=./src
ASSETDIR=../assets/faust
OUTTSCDIR=../out-tsc/src/faust
OUTSRCDIR=../src
FILES=	$(TARGETDIR)/eks.html \
	$(TARGETDIR)/ks.html \
	$(TARGETDIR)/sitar.html \
	$(TARGETDIR)/elecGuitar.html \
	$(TARGETDIR)/nylonGuitar.html \
	$(TARGETDIR)/steelGuitar.html \
	$(TARGETDIR)/bass.html

$(TARGETDIR)/%.html: $(SOURCEDIR)/%.dsp
	$(FAUSTWASM) $< $(TARGETDIR)

all:: $(FILES)
	# for f in `$(MAKE) -silent echo`; do $(MAKE) $$f; done
	mkdir -p $(ASSETDIR) 
	mkdir -p $(TARGETDIR)/faustwasm
	mkdir -p $(OUTTSCDIR)/faustwasm
	mv $(TARGETDIR)/*.wasm $(TARGETDIR)/*.json $(ASSETDIR)
	rm $(TARGETDIR)/*.js $(TARGETDIR)/*.html
	# my server chokes on the delivered index.js
	cp $(SOURCEDIR)/index.xx $(TARGETDIR)/faustwasm/index.js
	# the typescript compiler complains about a type
	cp $(SOURCEDIR)/index.d.xx $(TARGETDIR)/faustwasm/index.d.ts
	# copy the constructed faustwasm directory into the src
	rsync -av $(TARGETDIR)/faustwasm/ $(OUTSRCDIR)/faustwasm/
	# copy the constructed faustwasm directory into the typescript output
	rsync -av $(OUTSRCDIR)/faustwasm/ $(OUTTSCDIR)/faustwasm/

clean:: ; rm -rf $(TARGETDIR)/* $(ASSETDIR)/*

echo:: ; echo $(FILES)
