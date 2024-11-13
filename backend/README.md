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
$ source ./.venv/bin/activate
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

5. **Installer les données de bases :**
```bash
$ python manage.py loaddata tags.json
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


### Lancer les tests
```bash
$ python manage.py test --noinput
```

### Lancer le serveur
```bash
$ python .\manage.py runserver 0.0.0.0:8000
```