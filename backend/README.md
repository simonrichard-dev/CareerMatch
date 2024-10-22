# CareerMatch

### Étapes d'installation

1. **Créer un environnement virtuel Python:**
```bash
$ python -m venv .venv
```

2. **Activer un environnement virtuel Python:**
Windows:
```bash
$ ./.venv/Scripts/activate
```

Linux:
```bash
$ souce ./.venv/bin/activate
```

3. **Installer les dépendances :**
```bash
$ pip install -r requirements.txt
```

4. **Configurer les varialles d'environnement :**
Créer un fichier `.env` dans le dossier `back-end` et y ajouter les variables d'environnement suivantes :

```env
SECRET_KEY=ma_cle_secrète
```


### Étapes de migrations

1. **Créer les fichiers, mettre à jours les fichiers migrations:**
```bash
$ python manage.py makemigrations
```

1. **Appliquer les fichiers migrations:**
```bash
$ python manage.py migrate
```