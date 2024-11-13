# CareerMatch

**The history :**

**CareerMatch** was born out of a desire to revolutionize the recruitment process, offering a more engaging and human alternative to traditional platforms, which are often seen as impersonal and tedious. Tired of the typical, uninspiring job application sessions, this project aims to simplify the connection between talents and recruiters in a visually dynamic and intuitive way.
With **CareerMatch**, the goal is to bring candidates and employers closer together by making the experience seamless and inspiring, while valuing each profile and opportunity.

## Installation

### Prérequis

- **Node.js** et **npm**
- **Expo CLI**
- **Backend Stack** : Django, REST Framework

### Clone the repository :
```bash
$ git clone https://github.com/simonrichard-dev/CareerMatch
$ cd CareerMatch
```

### The frontend
1 **Installation**
```bash
$ cd frontend
$ npm install
```

2 **Launch frontend server**
```bash
$ npm start
```

Choose an interface (Android, web or Expo Go) and follow the instruction on the terminal.

### The backend
1. **Create a virtual environnement**
```bash
$ cd backend
$ python -m venv .venv
```

2. **Activate the virtual environnement**
 - Command for Windows :
```bash
$ ./.venv/Scripts/activate
```

- Command for Linux :
```bash
$ souce ./.venv/bin/activate
```

3. **Install dependencies :**
```bash
$ pip install -r requirements.txt
```

4. **Configure environment variables :**
Create a `.env` file in the `back-end` folder and add the following environment variables:

```env
SECRET_KEY=ma_cle_secrète
```

5. **Install the basic data :**
```bash
$ python manage.py loaddata tags.json
```

### Migration steps

6. **Create files, update migration files:**
```bash
$ python manage.py makemigrations
```

7. **Apply migration files:**
```bash
$ python manage.py migrate
```

8. **Run the tests**
```bash
$ python manage.py test --noinput
```

9. **Start the server**
```bash
$ python .\manage.py runserver 0.0.0.0:8000
```


## **Contributing**

Contributions are welcome to the project! 

To contribute:

* Fork the repository.
* Create a new branch (git checkout -b feature/your-feature).
* Make your changes.
* Submit a pull request.

Make sure to run the tests and follow the code style guidelines before submitting.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

You are free to use, modify, and distribute this software under the terms of the AGPL-3.0 license, but any derivative works or distributed versions of this project must also be open-source and licensed under the AGPL-3.0.

For more information, see the full license text in the [LICENSE](./LICENSE) file or visit the [AGPL website](https://www.gnu.org/licenses/agpl-3.0.html).


## **Author**

* **Simon RICHARD** - [Simon RICHARD](https://github.com/simonrichard-dev)
* **Jérémy DECKER** - [Jérémy DECKER](https://github.com/jydzip)