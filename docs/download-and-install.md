# Download and Install GanttLab

## Docker

Have [Docker installed](https://www.docker.com/products/docker-desktop) on your computer? You can run GanttLab right now from the official Docker image with this one liner in your console:

```bash
docker run -p 8282:80 ganttlab/ganttlab
```

Enjoy it on http://localhost:8282.

The official GanttLab Docker image comes with the default configuration, as you can experience on https://app.ganttlab.com. If you want to customize configuration through environment variables, you'll need to build your own version of GanttLab, and then create your Docker image with that version you built. Keep reading!

## Serve and build

You are free to build GanttLab yourself: you'll gain access to advanced customization, and be able to install it on your own infrastructure. You need [Node.js](https://nodejs.org/) version 12 and:

```bash
# install dependencies
yarn install
```

The GanttLab web application is conveniently using [Vue CLI](https://cli.vuejs.org/).

### Configuring

While building GanttLab, you'll be able to override key configuration values with those environment variables:

| Key | Description | Defaults to |
|-----|-------------|-------------|
| `VUE_APP_GANTT_START_STRING` | The string to search for, at the beginning of any line from an issue description, as the **Gantt start date** | `GanttStart:` |
| `VUE_APP_GANTT_DUE_STRING` | The string to search for, at the beginning of any line from an issue description, as the **Gantt due date** | `GanttDue:` |
| `VUE_APP_MOMENTJS_LOCALE` | Moment.js [locale configuration](http://momentjs.com/docs/#/i18n/) to display dates in your usual language | `window.navigator.language` |
| `VUE_APP_MOMENTJS_TIMEZONE` | Moment.js [default time zone](https://momentjs.com/timezone/docs/#/using-timezones/default-timezone/) | `moment.tz.guess()` |

### Serve with hot reload

To serve GanttLab from your computer in developer mode (with hot reload) at http://localhost:8080, just run:

```bash
# serve in developer mode with hot reload
yarn run webapp
```

You can use the environment variables described above. For example, to change Moment.js locale, it's as easy as:

```bash
# serve in developer mode with hot reload and a custom Moment.js locale
VUE_APP_MOMENTJS_LOCALE=fr yarn run webapp
```

### Build as a static website

GanttLab is ultimately a **frontend only** application. You can call it a static website, the M & J of the [JAMstack](https://jamstack.org/), or whatever fancy new name that will come up sooner or later. To get the static content, simply build the application:

```bash
# build for production
yarn run build:webapp
```

There too, you can take advantage of the environment variables:

```bash
# build for production with a custom Moment.js locale
VUE_APP_MOMENTJS_LOCALE=fr yarn run build:webapp
```

Then it's up to you to host the `packages/ganttlab-adapter-webapp/dist` generated folder anywhere you want! Feel free to test it first with:

```bash
# serve it right now (see https://github.com/zeit/serve)
npx serve packages/ganttlab-adapter-webapp/dist
```

That was it! Head to http://localhost:5000/ to use your production grade instance of GanttLab, temporarily hosted on your local computer.

### Docker again

You just built your own version of GanttLab, and can now embed it in your own Docker image, using for example this simple `Dockerfile`:

```Dockerfile
FROM nginx:alpine
COPY packages/ganttlab-adapter-webapp/dist /usr/share/nginx/html
```

Please refer to the [nginx](https://hub.docker.com/_/nginx) image for more details, and the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command documentation to know how to build your Docker image from there.