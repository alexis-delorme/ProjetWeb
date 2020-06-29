from zipfile import ZipFile
import json
import re
import sqlite3
import os


def get_zip_info(country,continent):
    with ZipFile(continent,'r') as z:
        # infobox du pays
        return json.loads(z.read(country))


def get_name(info):
    nomPays = info.get('conventional_long_name')
    # Cas spécial pour les infobox où il en manque 'conventional_long_name'
    # Par exemple pour l'infobox de Grenada
    if nomPays == None:
        nomPays = info.get('common_name')
    return nomPays


def get_capitale(info):
    capitale = info.get('capital')
    capitale = capitale[capitale.index('[[') + 2 : capitale.index(']]')]
    return capitale

#
# Conversion d'une chaîne de caractères décrivant une position géographique
# en coordonnées numériques latitude et longitude
#
def cv_coords(str_coords):
    # on découpe au niveau des "|" 
    c = str_coords.split('|')

    # on extrait la latitude en tenant compte des divers formats
    lat = float(c.pop(0))
    if (c[0] == 'N'):
        c.pop(0)
    elif ( c[0] == 'S' ):
        lat = -lat
        c.pop(0)
    elif ( len(c) > 1 and c[1] == 'N' ):
        lat += float(c.pop(0))/60
        c.pop(0)
    elif ( len(c) > 1 and c[1] == 'S' ):
        lat += float(c.pop(0))/60
        lat = -lat
        c.pop(0)
    elif ( len(c) > 2 and c[2] == 'N' ):
        lat += float(c.pop(0))/60
        lat += float(c.pop(0))/3600
        c.pop(0)
    elif ( len(c) > 2 and c[2] == 'S' ):
        lat += float(c.pop(0))/60
        lat += float(c.pop(0))/3600
        lat = -lat
        c.pop(0)

    # on fait de même avec la longitude
    lon = float(c.pop(0))
    if (c[0] == 'W'):
        lon = -lon
        c.pop(0)
    elif ( c[0] == 'E' ):
        c.pop(0)
    elif ( len(c) > 1 and c[1] == 'W' ):
        lon += float(c.pop(0))/60
        lon = -lon
        c.pop(0)
    elif ( len(c) > 1 and c[1] == 'E' ):
        lon += float(c.pop(0))/60
        c.pop(0)
    elif ( len(c) > 2 and c[2] == 'W' ):
        lon += float(c.pop(0))/60
        lon += float(c.pop(0))/3600
        lon = -lon
        c.pop(0)
    elif ( len(c) > 2 and c[2] == 'E' ):
        lon += float(c.pop(0))/60
        lon += float(c.pop(0))/3600
        c.pop(0)
    
    # on renvoie un dictionnaire avec les deux valeurs
    return {'lat':lat, 'lon':lon }


def get_coords(wp_info):
    # Cas spécial pour United States : les coordonnées n'existent pas dans l'infobox sous 'coordinates'
    if wp_info.get('conventional_long_name') == 'United States of America':
        str_coords = '38|53|N|77|01|W|'
        # on convertit en numérique et on renvoie
        if str_coords[0:1] in '0123456789':
            return cv_coords(str_coords)
            
    # S'il existe des coordonnées dans l'infobox du pays
    # (cas le plus courant)
    if 'coordinates' in wp_info:
        # (?i) - ignorecase - matche en majuscules ou en minuscules
        # ça commence par "{{coord" et se poursuit avec zéro ou plusieurs
        #   espaces suivis par une barre "|"
        # après ce motif, on mémorise la chaîne la plus longue possible
        #   ne contenant pas de },
        # jusqu'à la première occurence de "}}"
        m = re.match('(?i).*{{coord\s*\|([^}]*)}}', wp_info['coordinates'])
        # l'expression régulière ne colle pas, on affiche la chaîne analysée pour nous aider
        # mais c'est un aveu d'échec, on ne doit jamais se retrouver ici
        if m == None :
            print(' Could not parse coordinates info {}'.format(wp_info['coordinates']))
            return None
        # cf. https://en.wikipedia.org/wiki/Template:Coord#Examples
        # on a récupère une chaîne comme :
        # 57|18|22|N|4|27|32|W|display=title
        # 44.112|N|87.913|W|display=title
        # 44.112|-87.913|display=title
        str_coords = m.group(1)
        # on convertit en numérique et on renvoie
        if str_coords[0:1] in '0123456789':
            return cv_coords(str_coords)

def get_flag(nom):
    nomLC = nom.lower()
    lenNom = len(nomLC)
    dirs = os.listdir('client/flags')
    for file in dirs:
        for i in range(lenNom):
            if file[i:lenNom] == nomLC:
                return file
            else:
                break





def save_country(conn,country,info):
    c = conn.cursor()
    sql = 'INSERT OR REPLACE INTO countries VALUES (?, ?, ?, ?, ?, ?)'
    # On enlève '.json' dans le string country
    countryNoJSON = re.sub('\.json$', '', country)
    print(countryNoJSON)
    name = get_name(info)
    capital = get_capitale(info)
    coords = get_coords(info)
    flag = get_flag(countryNoJSON)

    c.execute(sql,(countryNoJSON,name,capital,coords['lat'],coords['lon'], flag))
    conn.commit()

def save_all_countries(continent):
    conn = sqlite3.connect('pays.sqlite')
    with ZipFile(continent,'r') as zipObj:
        listnames = zipObj.namelist()
    for country in listnames:
        info = get_zip_info(country,continent)
        save_country(conn,country,info)


# Pour stocker toutes les données
save_all_countries('north_america.zip')



#print(get_flag('Barbados'))