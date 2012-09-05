# -*- coding: utf-8 -*-

# Copyright (C) 2012, Diego Rabatone
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

import csv
import json
from decimal import *

partidos_principais = ["PMDB","PSDB","PT","PP","DEM","PTB","PR","PDT","PSB","PPS","PV","PSC","PRB","PMN","PCdoB"]
estados = ["AC","AL","AM","AP","BA","CE","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"]

# Carregando arquivo csv com os dados na variável f
    # O arquivo csv não deve conter cabeçalho e deve usar virgula como separador.
f = open('dados.csv', 'r')

#lendo a variável com o DictReader, que vai gerar um dicionário que não vai estar no formato que desejamos, ainda.
reader = csv.DictReader(f,delimiter=";",fieldnames=("nome_partido","Geral_abs","Geral_perc","AC_abs","AC_perc","AL_abs","AL_perc","AM_abs","AM_perc","APbs","AP_perc","BA_abs","BA_perc","CE_abs","CE_perc","ES_abs","ES_perc","GO_abs","GO_perc","MA_abs","MA_perc","MG_abs","MG_perc","MS_abs","MS_perc","MT_abs","MT_perc","PA_abs","PA_perc","PB_abs","PB_perc","PE_abs","PE_perc","PI_abs","PI_perc","PR_abs","PR_perc","RJ_abs","RJ_pe","RN_abs","RN_perc","RO_abs","RO_perc","RR_abs","RR_perc","RS_abs","RS_perc","SC_abs","SC_perc","SE_abs","SE_perc","SP_abs","SP_perc","TO_abs","TO_perc"))

dados_parciais = {}
dados_parciais['outros'] = {}
dados_finais = {}

#Gerando o dicionário no formato que precisamos.
for linha in reader:
    if linha['nome_partido'] in partidos_principais:
        dados_parciais[linha['nome_partido']] = linha
    else:
        dados_parciais['outros'][linha['nome_partido']] = linha

def dictAbsolutos(dicionario):
    resultado = {} #dicionário só com dados absolutos
    resultado['outros'] = {}
    #consolidando dados_absolutos
    for partido in dicionario:
        if partido != "outros":
            resultado[partido]={}
            for estado in estados:
                print resultado[partido]
                resultado[partido][estado] = dicionario[partido][estado + "_abs"]
        else:
            for outros_partido in partido:
                resultado['outros'][outros_partido] = {}
                for estado in estados:
                        resultado['outros'][outros_partido][estado] = dicionario['outros'][outros_partido][estado + "_abs"]
    return resultado

dados_finais_absolutos = dictAbsolutos(dados_parciais)

print dados_finais_absolutos
