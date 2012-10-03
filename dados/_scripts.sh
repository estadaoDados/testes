#!/bin/bash

function ajustaConteudos {
    PARTIDOS=`tr '[A-Z]' '[a-z]' < lista_partidos`
    FINAL="_estados.json"
    VOTOS="votos_"
    ELEITORADO="eleitorado_"

    for partido in $PARTIDOS
        do
            arquivo=_prefeitos/prefeitos_$partido$FINAL
            echo $arquivo
            sed -e 's@prefeitos@votos@g' $arquivo > $VOTOS$partido$FINAL
            sed -e 's@prefeitos@eleitorado@g' $arquivo > $ELEITORADO$partido$FINAL
        done
}

function criandoPatterns {
    ARQUIVOS=`ls *estados*.json`
    TEMPFILE="TEMPFILE.tmp"
    for arquivo in $ARQUIVOS
        do
            #sed -e 's@dados2008":\[(\d\+),(.*?),(\d\+)\],"dados2012@dados2008":[\1,0,\3],"dados2012@g' $arquivo > $TEMPFILE
            sed -e 's@valor_2@0@g' $arquivo > $TEMPFILE
            mv $TEMPFILE $arquivo
        done
}

criandoPatterns

function mudaConteudo {
    ARQUIVOS_PREFEITOS=`ls prefeitos*`
    ARQUIVOS_VOTOS=`ls votos*`
    ARQUIVOS_ELEITORADO=`ls eleitorado*`
    TEMPFILE="TEMPFILE.tmp"
    
    for arquivo in $ARQUIVOS_PREFEITOS 
        do
            #echo "$arquivo"
            #sed -e 's/nextlevel":"/nextlevel":"prefeitos_/' $arquivo > $TEMPFILE
            sed -e 's@\[30,30,1200\]@[valor_1,valor_2,valor_maximo]@g' $arquivo > $TEMPFILE
            mv $TEMPFILE $arquivo
        done
    
    for arquivo in $ARQUIVOS_VOTOS
        do
            #sed -e 's/nextlevel":"/nextlevel":"votos_/' $arquivo > $TEMPFILE
            mv $TEMPFILE $arquivo
        done
    
    for arquivo in $ARQUIVOS_ELEITORADO
        do
            #sed -e 's/nextlevel":"/nextlevel":"eleitorado_/' $arquivo > $TEMPFILE
            mv $TEMPFILE $arquivo
        done
}

function geraArquivosCopiados {
    #PARTIDOS=`cat lista_partidos`
    PARTIDOS=`tr '[A-Z]' '[a-z]' < lista_partidos`
    FINAL="_estados.json"
    
    for partido in $PARTIDOS
            do
                cp partido_estados.json $partido$FINAL
            done
}

function gera_outros_estados {
    BASE="estados.json"
    for arquivo in `ls *$BASE`
        do
            echo $arquivo | sed 's/(*)estados.json/\1estados_outros.json/g'
        done
}

function corrige_estados_iniciais {
    BASE="estados.json"
    TEMPFILE="TEMPFILE.tmp"
    for arquivo in `ls *$BASE`
        do
            sed '/"AM"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
            sed '/"MS"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
            sed '/"SE"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
            sed '/"RO"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
            sed '/"TO"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
            sed '/"AC"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
            sed '/"AP"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
            sed '/"RR"/d' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
        done
}

function ajustaVirgula {
    ARQUIVOS=`ls *estados.json`
    TEMPFILE="TEMPFILE.tmp"
    for arquivo in $ARQUIVOS
        do
            sed '19s@\(.*\),$@\1@g' $arquivo > $TEMPFILE
            cp $TEMPFILE $arquivo
        done
}

