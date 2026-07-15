# Live Demo Script — ~40–45 minutes

Goal: trainees should *see*, not just hear about, a commit turning into a
running pod. Every stage should produce visible proof on screen.

Do the full one-time setup from README.md **before** class. This script
assumes Jenkins, Minikube, and the Jenkins job already exist.

---

## 1. Set the stage (5 min)

Show the big picture first — draw or display this flow:

```
Dev pushes code -> GitHub -> Jenkins polls/triggers -> npm test
   -> docker build -> docker push (DockerHub) -> kubectl set image (Minikube)
```

Talking point: "Every one of these tools you've already learned individually
this week. Today we chain all of them into one pipeline."

Show the repo structure in VS Code: `app/`, `k8s/`, `Jenkinsfile`. Point out
the Jenkinsfile stages match the diagram 1:1.

## 2. Show the starting state (5 min)

- `kubectl get pods` — 2 pods running, old image tag
- Open the app in browser via `http://localhost:30080` — show current message/version
- Open DockerHub in browser — show the current `latest` tag's push time
- Open Jenkins job — show build history, click into the last successful build's stage view

## 3. Make a real change (5 min)

Live-edit `app/server.js`: change the `MESSAGE` constant to something visibly
different (e.g. add "— now v2!"). This is the one moment trainees need to
believe the whole pipeline is real, not staged.

```bash
git add .
git commit -m "demo: update welcome message"
git push
```

## 4. Trigger and narrate the pipeline (15–20 min)

If using "Poll SCM," either wait for the poll interval or click **Build Now**
to keep it snappy for the room.

Walk the **Stage View** left to right as it runs, narrating each box:

| Stage | What to say while it runs |
|---|---|
| Checkout | "Jenkins just cloned the exact commit we pushed 30 seconds ago." |
| Install & Test | "This is the same `npm test` you'd run locally — if it fails here, the pipeline stops. Nothing broken gets deployed." |
| Docker Build | "This builds the image from our Dockerfile — same one from the Docker lab, just triggered automatically now." |
| Docker Push | Switch to the DockerHub tab, refresh — "There's the new tag, pushed seconds ago by Jenkins, not by us manually." |
| Deploy to Kubernetes | "`kubectl set image` tells the Deployment to roll out the new image — watch the pods." |
| Verify | Show console output of `kubectl get pods` — new pods `Running`, old ones terminating. |

## 5. Prove it end-to-end (5 min)

- `kubectl get pods` again — new pods, fresh AGE
- Refresh the browser tab on the NodePort URL — new message is live
- Optional: `kubectl rollout history deployment/simple-node-demo` — show revision history

Talking point: "Nobody typed `docker build`, `docker push`, or `kubectl` by
hand after the push. That's the whole point of CI/CD."

## 6. Wrap-up discussion (5 min)

Good prompts for trainees:
- "What would happen if I'd broken a test just now?" (pipeline stops at Test, nothing gets deployed — safety net)
- "Why push to DockerHub instead of building straight on the k8s node?" (image is now portable/pullable by any cluster, not just this laptop)
- "What's missing here for a real production pipeline?" (staging environment, approval gate, rollback strategy, monitoring — good segue if you're covering those later)

## Fallback if something breaks live

Keep a second terminal with a pre-built, known-good image tag ready. If a
stage fails, you can `kubectl set image ... image:known-good-tag` manually to
get the demo back on track without losing the room, and debug the Jenkins
issue after class.
