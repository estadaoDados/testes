#!/bin/bash

CHEIOS=( dem pcdob pdt phs pmdb pmn pp pps pr prb prp prtb psb psc psdb psdc psl pt ptdob ptb ptc ptn pv )
VAZIOS=( pcb pco psol pstu )
BASE="votos_"
COMPLEMENTO="_estados.json"
COMPLEMENTOUTROS="_estados_outros.json"

for i in "${CHEIOS[@]}"
    do
        echo $BASE$i$COMPLEMENTO
        cp base $BASE$i$COMPLEMENTO
    done
for i in "${VAZIOS[@]}"
    do
        #echo $BASE$item$COMPLEMENTO
        cp base_outros  $BASE$i$COMPLEMENTOUTROS
    done
