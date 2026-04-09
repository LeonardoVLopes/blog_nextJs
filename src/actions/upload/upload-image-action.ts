'use server'

import { logColor } from "@/utils/log-color"

export async function uploadImageAction() {
    logColor('action de uploadImage')

    return {
        user: 'senha do usuario',
    }
}